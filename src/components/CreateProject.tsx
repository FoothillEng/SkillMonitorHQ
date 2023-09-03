const CreateProject = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="text-black">
                <input
                    type="text"
                    placeholder="Enter project name here..."
                    className="w-[15rem] text-center rounded border border-gray-400 py-2"
                />
            </div>
            <h1 className="text-3xl font-bold  outline outline-4 outline-teal-800 hover:bg-green-900 mt-8 p-2">
                Create Project
            </h1>
        </div>
    );
};

export default CreateProject;
