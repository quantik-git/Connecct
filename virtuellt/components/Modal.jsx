const Modal = ({ showModal, setShowModal, children }) => {
    return (
        showModal ? (
            <div className="flex justify-center items-center fixed inset-0 z-50 w-full">
                <div className={"flex flex-col rounded-lg shadow-lg bg-white p-6 my-6 mx-6 z-50"} >
                    <div className="flex flex-col space-y-2">
                        {children}
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-gray-800" onClick={() => setShowModal(false)}></div>
            </div>
        ) : <></>
    )
}

export default Modal
