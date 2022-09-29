import React from "react";
import toast, { Toaster } from "react-hot-toast"; 

function Alert({ alert }) {
  // const capitalize = (word) => {
  //   if (word === "warning" || word === "danger") {
  //       return word = "Error!"
  //   }
  //   const lower = word.toLowerCase();
  //   return lower.charAt(0).toUpperCase() + lower.slice(1);
  // };
  // return (
  //   <div >
  //   {/* <div style={{ height: "50px" }}> */}
  //     {props.alert && (
  //       <div
  //         className={`alert alert-${props.alert.type} alert-dismissible fade show`}
  //         role="alert"
  //       >
  //         <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
  //       </div>
  //     )}
  //   </div>
  // );
  if (alert) {
    if (alert.type === "success") {
      toast.success(alert.message)
    }
    if (alert.type === "error" || alert.type === "danger" || alert.type === "warning") {
      toast.error(alert.message)
    } 
  }

  // Default
  const DefaultNotify = () => toast('Here is your toast.');

  // Success
  const SuccessNotify = () => toast.success('Successfully toasted!')

  // Error
  const ErrorNotify = () => toast.error("This didn't work.")

  // Promise
  // const fetchData = async () => {
  //   const response = await axios.get(
  //     "https://jsonplaceholder.typicode.com/users"
  //   );
  //   console.log({ response });
  //   return response;
  // };

  //  toast.promise(
  //   fetchData(),
  //   {
  //     loading: 'loading...',
  //     success: 'Successfully get data',
  //     error: "error occurs in data",
  //   }
  // );



  // Emoji or icon
  const IconNotify = () => toast('Good Job!', {
    icon: '👏',
  });




  return (
    <> 
      <Toaster position="top-right" />
    </>
  );




}

export default Alert;
