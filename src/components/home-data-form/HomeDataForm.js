import React, { useEffect, useRef, useState } from "react";
import "./HomeDataForm.css";
import { PDFExport } from "@progress/kendo-react-pdf";
import ReactPaginate from "react-paginate";
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
  const [toggleEdit, setToggleEdit] = useState(true);

  // showing items per page :
  const itemsPerPage = 10;
  // state to know starting item value:
  const [itemsOffset, setItemsOffset] = useState(0);

  // it is used to find out the end value per page to show:
  const endOffset = itemsOffset + itemsPerPage;
  console.log(`Loading items from ${itemsOffset} to ${endOffset}`);
  const currentItems = data?.slice(itemsOffset, endOffset);

  // pages according to the items:
  const pageCount = Math.ceil(data.length / itemsPerPage);

  //   previous and next arrow :
  const previousArrow = <i className="fas fa-arrow-left mr-10" id="prev"></i>;
  const nextArrow = <i className="fas fa-arrow-right ml-10" id="next"></i>;
  // handle new page
  const handlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % data.length;
    setItemsOffset(newOffset);
  };

  const handleSubmit = (e, index) => {
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

        {toggleEdit ? (
          <div
            onClick={handleSubmit}
            className="bg-black text-white rounded-md p-3 text-center w-full mt-2 cursor-pointer hover:bg-white hover:text-black transition-all duration-700 ease-in-out"
          >
            Submit
          </div>
        ) : (
          <div
            className="bg-black text-white rounded-md p-3 text-center w-full mt-2 cursor-pointer hover:bg-white hover:text-black transition-all duration-700 ease-in-out"
          >
            Modify
          </div>
        )}
      </form>
      <div
        className="flex justify-center items-center p-2 bg-[#2f4ad0] mt-2 w-32 rounded-md text-white float-right shadow-md tracking-normal hover:select-none hover:w-36 cursor-pointer transition-all duration-500 ease-in-out"
        onClick={exportWithComponent}
      >
        Save All <i className="fas fa-download ml-2"></i>
      </div>
      {currentItems && (
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
              {currentItems &&
                currentItems?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{`${new Date().getDate()} / ${
                        new Date().getUTCMonth() + 1
                      } / ${new Date().getFullYear()}`}</td>
                      <td>{item?.firstName}</td>
                      <td>{item?.amount}</td>
                      <td>
                        <i className="fas fa-edit mr-4 cursor-pointer"></i>
                        <i onClick={() => handleDelete(index)} className="fas fa-trash cursor-pointer"></i>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </PDFExport>
      )}
      <ReactPaginate
        className="w-full flex justify-center items-center text-base p-3"
        breakLabel="..."
        activeClassName="bg-indigo-500 rounded-full text-white"
        nextLabel={nextArrow}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        pageClassName="pl-3 pr-3 ml-2 mr-2 transition-all duration-500 cursor-pointer ease-in-out hover:bg-indigo-500 pt-1 pb-1 hover:text-white hover:rounded-full"
        previousLabel={previousArrow}
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default HomeDataForm;
