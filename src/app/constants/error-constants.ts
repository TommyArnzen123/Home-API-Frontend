import { IError } from "../model/error.interface";
import { IModal } from "../model/modal.interface";

// Error Objects.
export const REGISTER_USER_ERROR : IError = {
    message: "There was an error registering the user.",
    errorCode: "0001", 
}


// Error Modal Objects.
export const REGISTER_USER_ERROR_MODAL: IModal = {
    title: 'Something Went Wrong...',
    content: REGISTER_USER_ERROR.message,
    footer: "Error Code: " + REGISTER_USER_ERROR.errorCode,
}