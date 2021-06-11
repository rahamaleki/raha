import React, { FunctionComponent, ReactElement, useState,useRef } from 'react';
import {AgGridReact,AgGridColumn} from "ag-grid-react"
import {ColDef} from "ag-grid-community"
import './App.css';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import { IRowData ,IRow} from "./interface";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  GridApi,
  ColumnApi,
  GridReadyEvent,
  RowNode,
} from "ag-grid-community";
import axios from 'axios';

const App: FunctionComponent = (): React.ReactElement => {
  const [gridApi, setGridApi] = useState<GridApi>();
  const [columnApi, setColumnApi] = useState<ColumnApi>();
  const[rowData,setRowData]=useState<IRowData>([])
  const gridRef = useRef(null);
  const [usernameForm, setUsernameForm] = useState<string>('')
  const [positionForm, setPositionForm] = useState<string>('')
  const [birthdayForm, setBirthdayForm] = useState<string>('')
  const [educationForm, setEducationForm] = useState<string>('')
  const[show,setShow]=useState<Boolean>(false)
  const columnDefs:ColDef[] = [
    {headerName:"نام و نام خانوادگی", field: "username" },
    {headerName:"شغل", field: "position" },
    {headerName:"سن", field: "birthday" },
    {headerName:"رشته تحصیلی", field: "education" }
  ]
  const onGridReady=(params:GridReadyEvent)=>{
    setGridApi(params.api)
    setColumnApi(params.columnApi)
    getMyRow()
    params.api.sizeColumnsToFit();
  }
  const handleClose=()=>{
    setUsernameForm('')
    setPositionForm('')
    setBirthdayForm('')
    setEducationForm('')
    setShow(false)

  }
  const getSelectedNode = () => {
    if(gridApi){
      const selectedNode: RowNode = gridApi.getSelectedNodes()[0];
      return selectedNode;
    }

  }

const getMyRow=()=>{
  axios.get(`http://localhost:5008/users`)
  .then(function (response) {
    // handle success
    setRowData(response.data)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}//read data

const addRow=(data:IRow)=>{
  console.log('data',data);
  axios.post(`http://localhost:5008/users`,{...data})
  .then(response=>{
    getMyRow()

  })
}// create row

const update=(data:IRow)=>{
  console.log('data',data);
  const selectedNode= getSelectedNode();
  if (selectedNode)
  axios.put(`http://localhost:5008/users/${selectedNode.data.id}`,{...data})
  .then(response=>{
    getMyRow()

  })
}//update row

const deleted: React.MouseEventHandler<HTMLButtonElement> = () => {
  const selectedNode= getSelectedNode();
  if (selectedNode && window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {

    axios.delete(`http://localhost:5008/users/${selectedNode.data.id}`)
    .then(response=>{
      getMyRow()

    })
  }else{
    alert('لطفا یک کاربر انتخاب کنید');
}

}//delete row

const showFormUpdate: React.MouseEventHandler<HTMLButtonElement> = () => {
  const selectedNode= getSelectedNode();
  if (selectedNode) {
    setUsernameForm(selectedNode.data.username)
    setPositionForm(selectedNode.data.position)
    setBirthdayForm(selectedNode.data.birthday)
    setEducationForm(selectedNode.data.education)

    setShow(true)
  }else{
      alert('لطفا یک کاربر انتخاب کنید');
  }
}//show update form

const showForm: React.MouseEventHandler<HTMLButtonElement> = () => {
  if(gridApi) gridApi.deselectAll()
    setShow(true)
}//show add form
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const data: IRow = {
    username: usernameForm,
    position: positionForm,
    birthday: birthdayForm,
    education: educationForm
};
  const selectedNode= getSelectedNode();
  if (selectedNode) {
        update(data)
        
  }else{
    addRow(data)

  }
  handleClose();
}


  return (
    <div className="container ">
    <div className="card ">
      <div className="card-body d-flex flex-row-reverse">
        <button onClick={showForm}  type="button" className="btn btn-secondary mx-3">ایجاد سطر جدید</button>
        <button onClick={showFormUpdate} type="button" className="btn btn-secondary mx-3">ویرایش</button>
        <button onClick={deleted}  type="button" className="btn btn-secondary mx-3">حذف</button>
      </div>
      
    
    </div>
    <div
      id="myGrid"
      style={{ height: "calc(100vh - 300px)",width:"100%" }}
      className="ag-theme-alpine-dark">
      <AgGridReact
        onGridReady={onGridReady}
        enableRtl={true}
        ref={gridRef}
        rowData={rowData}
        rowSelection="single"
      >
       {columnDefs.map((col)=>{
                            return <AgGridColumn
                            field={col.field}
                            headerName={col.headerName}
                            filter={false}
                            resizable={true}
                            cellClass='cellStyle' 
                            />
                          })}
         
                  </AgGridReact>
    </div>
    <Modal show={show} onHide={handleClose}  className="flex-row-reverse">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}  className="flex-row-reverse">
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">نام و نام خانوادگی</Form.Label>
                            <Col sm="8">
                                <Form.Control 
                                    type="text"
                                    required
                                    value={usernameForm}
                                    onChange={e => setUsernameForm(e.target.value)} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">شغل</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    required
                                    value={positionForm}
                                    onChange={e => setPositionForm(e.target.value)} />
                            </Col>
                        </Form.Group>

                  
                        <Form.Group as={Row}>
                            <Form.Label column sm="4"> سن</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    required
                                    value={birthdayForm}
                                    onChange={e => setBirthdayForm(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">رشته</Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    required
                                    value={educationForm}
                                    onChange={e => setEducationForm(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4"></Form.Label>
                            <Col sm="8">
                          <Button
                            size="lg"
                            variant="primary"
                            type="submit"
                            block>ثبت</Button>
                                   </Col>
                        </Form.Group>
                    </Form>
                    </Modal.Body>
            </Modal>
  </div>
   
  );
}

export default App;
