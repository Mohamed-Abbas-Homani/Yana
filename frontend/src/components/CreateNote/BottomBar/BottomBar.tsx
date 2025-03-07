import { FaPlus, FaTrash, FaTimes, FaDownload } from "react-icons/fa";
import { useFileNoteStore } from "../../../services/note";
import { useState, useMemo, useEffect } from "react";
import "./BottomBar.css";

const BottomBar = () => {
    const { files, setFiles } = useFileNoteStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ objectUrl: string; fileType: string } | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files ? Array.from(event.target.files) : [];
        setFiles([...files, ...newFiles]); // Add new files to the existing list
    };

    const removeFile = (indexToRemove: number) => {
        const updatedFiles = files.filter((_, i) => i !== indexToRemove);
        setFiles(updatedFiles);
    };

    const downloadFile = (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl); // Cleanup
    };

    const openModal = (objectUrl: string, fileType: string) => {
        setSelectedFile({ objectUrl, fileType });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
    };

    const filePreviews = useMemo(() => {
        return files.map((file) => {
            const objectUrl = URL.createObjectURL(file);
            return { file, objectUrl };
        });
    }, [files]);

    useEffect(() => {
        // Clean up the created object URLs to avoid memory leaks
        return () => {
            filePreviews.forEach(({ objectUrl }) => {
                URL.revokeObjectURL(objectUrl);
            });
        };
    }, [filePreviews]);

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
                {filePreviews.length > 0 &&
                    filePreviews.map(({ file, objectUrl }, index) => {
                        const fileType = file.type;
                        const isImage = fileType.startsWith("image/");
                        const isVideo = fileType.startsWith("video/");

                        return (
                            <div className="file-item fade-in" key={index}>
                                {isImage && (
                                    <div
                                        className="image-file"
                                        style={{
                                            backgroundImage: `url(${objectUrl})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                        onClick={() => openModal(objectUrl, fileType)}
                                    ></div>
                                )}
                                {isVideo && (
                                    <div className="video-file" onClick={() => openModal(objectUrl, fileType)}>
                                        <video>
                                            <source src={objectUrl} type={fileType} />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )}
                                {!isImage && !isVideo && <div className="file-icon">📄</div>}
                                <p className="file-name">{truncateFileName(file.name)}</p>
                                <div className="file-actions">
                                    <div
                                        className="file-remove-button"
                                        onClick={() => removeFile(index)}
                                    >
                                        <FaTrash size={"1em"} />
                                    </div>
                                    <div
                                        className="file-download-button"
                                        onClick={() => downloadFile(file)}
                                    >
                                        <FaDownload size={"1em"} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Modal Component */}
            {isModalOpen && selectedFile && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {selectedFile.fileType.startsWith("image/") && (
                            <img src={selectedFile.objectUrl} alt="Preview" className="modal-image" />
                        )}
                        {selectedFile.fileType.startsWith("video/") && (
                            <video controls className="modal-video">
                                <source src={selectedFile.objectUrl} type={selectedFile.fileType} />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        <button className="close-modal-button" onClick={closeModal}>
                            <FaTimes size={"1.5em"} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
const truncateFileName = (name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;

    const extIndex = name.lastIndexOf('.');
    const hasExtension = extIndex !== -1 && extIndex !== 0 && extIndex !== name.length - 1;
    const ext = hasExtension ? name.slice(extIndex) : '';
    const baseName = hasExtension ? name.slice(0, extIndex) : name;

    if (baseName.length + ext.length <= maxLength) return name;

    const truncated = baseName.slice(0, maxLength - ext.length - 3) + '...' + ext;

    return truncated;
};

export default BottomBar;
