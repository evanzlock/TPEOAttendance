import React, {useState, useEffect} from 'react'
import MaterialTable from '@material-table/core'

const MemberTable = () => {

  const [data, setData] = useState([]);
  

    useEffect(() => {
     const fetchData = async () => {
        await fetch('http://localhost:5000/members?type=General', {
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
            })
        }).catch(error => {
            console.log(error);
        })
        }
        fetchData();
    }, [])

    const options = {
      filtering: true,
      //turns the row green or red depending on num absences
      rowStyle: rowData => ({backgroundColor: (rowData.unexcused + rowData.tardies/2)  > 3 ? "#ffa9a966" : "#a3ebb366"}),
    };
    

  const columns=[
    {title: "Name", field: "name", filtering:false, width: '10px'},
    {title: "Team", field: "team", lookup: {Design: "Design", Engineering: "Engineering", Product: "Product", Executive: "Executive"}, width: '10px'},
    {title: "Meetings Attended", field: "total", filtering:false, width: '10px'},
    {title: "Unexcused Absences", field: "unexcused", filtering:false, width: '10px'},
    {title: "Tardies",field: "tardies", filtering:false, width: '10px'}
  ]

  
    return (
      <div>
        <MaterialTable columns={columns} data={data} title="All Members" options={options}/>
      </div>
    );
};

export default MemberTable


