import { FaPlus, FaTrash } from "react-icons/fa";

const BottomBar = ({files, setFiles}:{files: File[], setFiles: any}) => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files ? Array.from(event.target.files) : [];
        setFiles([...files, ...newFiles]); // Add new files to the existing list
    };
    const removeFile = (indexToRemove: number) => {
        const updatedFiles = files.filter((_, i) => i !== indexToRemove);
        setFiles(updatedFiles);
    };

    return (
        <div className="create-note-container-bottom">
            <div className="file-upload-container">
                <label htmlFor="file-upload" className="file-upload-button">
                    <FaPlus />
                </label>
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                />
            </div>
            <div className="file-list-horizontal">
                {files.length > 0 &&
                    files.map((file, index) => {
                        const fileType = file.type;
                        const isImage = fileType.startsWith("image/");
                        const isVideo = fileType.startsWith("video/");

                        return (
                            <div className="file-item fade-in" key={index}>
                                {isImage && (
                                    <div
                                        className="image-file"
                                        style={{
                                            backgroundImage: `url(${URL.createObjectURL(file)})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    ></div>
                                )}
                                {isVideo && (
                                    <video controls>
                                        <source src={URL.createObjectURL(file)} type={fileType} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                {!isImage && !isVideo && <div className="file-icon">📄</div>}
                                <p className="file-name">{file.name}</p>
                                <div
                                    className="file-remove-button"
                                    onClick={() => removeFile(index)}
                                >
                                    <FaTrash size={"1em"} />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default BottomBar;
