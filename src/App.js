import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import Icon from '@material-ui/core/Icon'; 
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const itemsFromBackend = [
  { id: uuid(), content: "First task" },
  { id: uuid(), content: "Second task" },
  { id: uuid(), content: "Third task" },
  { id: uuid(), content: "Fourth task" },
  { id: uuid(), content: "Fifth task" },
  { id: uuid(), content: "sixth task" }
];

const columnsFromBackend = {
  [uuid()]: {
    name: "Requested",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "To do",
    items: []
  },
  [uuid()]: {
    name: "In Progress",
    items: []
  },
  [uuid()]: {
    name: "Done",
    items: []
  },
  [uuid()]: {
    name: "Next",
    items: []
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
    // console.log("目的地1",destination,"元の土地1",source,"カラムズ1",columns,setColumns)
  if (source.droppableId !== destination.droppableId) {
    console.log("目的地2",destination,"元の土地2",source,"カラムズ2",columns,setColumns)
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    console.log("目的地3",destination,"元の土地3",source,"カラムズ3",columns,setColumns)
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};



const pre_create_task = (source,columns,setColumns,setPreCreate) =>{

  setPreCreate(
    [source.columnId]
  );
};


const create_task = (source,columns,setColumns,setPreCreate) =>{
  const column = columns[source.columnId]
  console.log("目的地4",source,"元の土地4",source,"カラムズ4",columns,setColumns)
  const copiedItems = [...column.items];
  const newItems = copiedItems;
  newItems.push({ id: uuid(), content: "seventh task" });
  setColumns({
    ...columns,
    [source.columnId]: {
      ...column,
      items:newItems
  }
  });
  setPreCreate(
    0
  )
};


const del_pre_create_task = (source,columns,setColumns,setPreCreate) =>{
  setPreCreate(
    0
  )
};



const create_board = (columns,setColumns) =>{
  console.log("カラムズ5",columns,"setter5",setColumns)
  setColumns({
    ...columns,
    [uuid()]:{name: "Added_Board",items:[]}
  });
};






function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [preCreate, setPreCreate] = useState(0);
  
  console.log(columns)
  return (
  <React.Fragment>
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                      >
                         <Paper                        
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                           background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "#f5f8f9",
                           padding: 4,
                           width: 250,
                          }}
                           elevation={3}
                          >
                      
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                <div>
                                 <Card 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#456C86"
                                        : "#0498fb",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                    >
                                    {item.content}
                                 </Card>
                                </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        {preCreate != columnId ? (
                        <IconButton onClick={source => pre_create_task(source={columnId},columns,setColumns,setPreCreate)}>
                        <Icon color="Primary">add_circle</Icon>
                        </IconButton>
                        ):(
                        <>
                          <Card 
                          style={{
                            userSelect: "none",
                            padding: 16,
                            margin: "0 0 8px 0",
                            minHeight: "50px",
                            backgroundColor: "#0498fb",
                            color: "white",
                          }}
                          >
                          <input 
                            style={{
                            border:"0",
                            userSelect: "none",
                            outline: "none",
                            padding: 16,
                            margin: "0 0 8px 0",
                            minHeight: "7.5px",
                            backgroundColor: "#0498fb",
                            color: "white",
                            }}
                           />
                        </Card>
                          <IconButton onClick={source => create_task(source={columnId},columns,setColumns,setPreCreate)}>
                          <Icon color="Primary">add_circle</Icon>
                          </IconButton>
                          <IconButton onClick={source => del_pre_create_task(source={columnId}, columns,setColumns,setPreCreate)}>
                          <Icon color="Secondary">remove_circle</Icon>
                          </IconButton>
                        </>
                        )}
                        </Paper>
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
      <IconButton 
        onClick={source => create_board(columns, setColumns)}
        style={{ display: "flex", justifyContent: "flex-start",height: "0%",margin: "84px 0 0 0"}}
        >
        <Icon color="Secondary">add_circle</Icon>
      </IconButton>    
      {



      }
    </div>
    </React.Fragment>
  );
}

export default App;
