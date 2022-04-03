import React, {useState, useEffect} from 'react'
import MaterialTable from '@material-table/core'

const MemberTable = (props) => {

  const [data, setData] = useState([]);
  //const [options, setOptions] = useState();
  

    useEffect(() => {
     const fetchData = async () => {
        await fetch('http://localhost:5000/members?type='+props.type, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            response.json().then((json) => {
                var gendata = json;
                gendata.sort(function(a, b) {
                    return parseFloat(a.name) - parseFloat(b.name);
                });
                setData(gendata); 
                /*setOptions({
                    //turns the row green or red depending on num absences
                    rowStyle: rowData => ({backgroundColor: rowData.unexcused  > 3 ? "#ffa9a966" : "#a3ebb366"}),
                    //TODO: KEEP TRACK OF THIS NUMBER (do not hardcode)
                    pageSize: gendata.length
                });*/
            })
        }).catch(error => {
            console.log(error);
        })
        }
        fetchData();
    }, [props.type])

    const options = {
      filtering: true,
      //turns the row green or red depending on num absences
      rowStyle: rowData => ({backgroundColor: rowData.unexcused  > 3 ? "#ffa9a966" : "#a3ebb366"}),
      //tableLayout: 'fixed',
    };
    

  const columns=[
    {title: "Name", field: "name", filtering:false, width: '10px'},
    {title: "Team", field: "team", lookup: {Design: "Design", Engineering: "Engineering", Product: "Product", Executive: "Executive"}, width: '10px'},
    {title: "Meetings Attended", field: "total", filtering:false, width: '10px'},
    {title: "Unexcused Absences", field: "unexcused", filtering:false, width: '10px'},
  ]

  
    return (
      <div>
        <MaterialTable columns={columns} data={data} title="All Members" options={options}/>
      </div>
    );
};

export default MemberTable


