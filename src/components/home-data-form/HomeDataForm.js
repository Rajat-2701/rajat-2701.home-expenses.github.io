import React, { useEffect, useRef, useState } from "react";
import "./HomeDataForm.css";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
const getDataFromLS = () => {
  const myData = localStorage.getItem("listing");
  if (myData) {
    return JSON.parse(myData);
  } else {
    return [];
  }
};

const HomeDataForm = () => {
  const [firstName, setFirstName] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState(getDataFromLS());
  const handleSubmit = (e) => {
    e.preventDefault();
    const lists = {
      firstName,
      amount,
    };
    setData([...data, lists]);
  };
  // useEffect to store data in local storage
  useEffect(() => {
    localStorage.setItem("listing", JSON.stringify(data));
  }, [data]);
  console.log("data", data);

  // delete particular entry :
  const handleDelete = (index) => {
    const deleteEntry = data.filter((item, number) => number !== index);
    setData(deleteEntry);
    console.log("data", data);
  };
  // edit particular entry
  const handleEdit = (index) => {
    const editEntry = data?.find((elem, number) => {
      return index === number;
    });
    console.log("edit", editEntry);
  };
  // pdf with method
  const exportWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };
  // pdf using ref
  const pdfExportComponent = useRef(null);
  return (
    <div className="home-data-form m-5">
      <div className="flex items-start justify-start">
        <h2 className="text-3xl uppercase font-serif font-medium">Fill the form details....</h2>
      </div>
      <form className="mt-10 flex flex-col ml-auto mr-auto items-start justify-between w-auto max-w-[500px] h-auto min-h-[400px] p-5 shadow-lg">
        <h2 className="font-medium text-lg uppercase font-sans border-b border-black">
          Your Daily Expenses saved here:
        </h2>
        <input
          type="text"
          className="border-black border-b w-full focus-visible:outline-0 placeholder:text-black p-2 text-black text-base"
          placeholder="Person Name"
          name="personName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          className="border-black border-b w-full focus-visible:outline-0 placeholder:text-black p-2 text-black text-base"
          placeholder="Amount"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div
          onClick={handleSubmit}
          className="bg-black text-white rounded-md p-3 text-center w-full mt-2 cursor-pointer hover:bg-white hover:text-black transition-all duration-700 ease-in-out"
        >
          Submit
        </div>
      </form>
      <div
        className="flex justify-center items-center p-2 bg-[#2f4ad0] mt-2 w-32 rounded-md text-white float-right shadow-md tracking-normal hover:select-none hover:w-36 cursor-pointer transition-all duration-500 ease-in-out"
        onClick={exportWithComponent}
      >
        Save All <i className="fas fa-download ml-2"></i>
      </div>
      {data && (
        <PDFExport ref={pdfExportComponent} paperSize='A3'>
          <table className="table table-bordered table-striped mt-20 text-center">
            <thead className="thead-dark">
              <tr className="text-lg">
                <th>Date</th>
                <th>Person Name</th>
                <th>Amount (in Rs.)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{`${new Date().getDate()} / ${
                        new Date().getUTCMonth() + 1
                      } / ${new Date().getFullYear()}`}</td>
                      <td>{item?.firstName}</td>
                      <td>{item?.amount}</td>
                      <td>
                        <i onClick={() => handleEdit(index)} className="fas fa-edit mr-4 cursor-pointer"></i>
                        <i onClick={() => handleDelete(index)} className="fas fa-trash cursor-pointer"></i>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </PDFExport>
      )}
    </div>
  );
};

export default HomeDataForm;
