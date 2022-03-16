import React, {useState, useEffect} from 'react'
import MaterialTable from '@material-table/core'

const MemberTable = () => {

  const [data, setData] = useState([]);

    useEffect(() => {
     const fetchData = async () => {
        await fetch('http://localhost:5000/members', {
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

    
    

  const columns=[
    {title: "Name", field: "name", filtering:false},
    {title: "Team", field: "team", lookup: {Design: "Design", Engineering: "Engineering", Product: "Product", Executive: "Executive"}},
    {title: "Meetings Attended", field: "total", filtering:false},
    {title: "Unexcused Absences", field: "unexcused", filtering:false},
  ]

  const options={
    rowStyle: rowData => ({backgroundColor: rowData.unexcused  > 3 ? "#ffa9a966" : "#a3ebb366"}),
    filtering:true,
    pageSize: 43
  }

    return (
      <div>
        <MaterialTable columns={columns} data={data} options={options} title="All Members"/>

      </div>
    );
};

export default MemberTable


