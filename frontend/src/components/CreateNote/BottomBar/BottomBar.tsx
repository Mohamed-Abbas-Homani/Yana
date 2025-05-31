import { FaPlus, FaTrash, FaTimes, FaDownload } from "react-icons/fa";
import { useFileNoteStore } from "../../../services/note";
import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const BottomBarContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem;
  width: 100%;
  height: 21%;
  background: var(--background-color);
  box-shadow:
    inset 7px 7px 13px color-mix(in srgb, var(--background-color) 89%, #000000),
    inset -7px -7px 13px color-mix(in srgb, var(--background-color) 97.5%, #fff);
`;

const FileUploadContainer = styled.div`
  position: absolute;
  top: 5%;
  left: 1%;
`;

const FileUploadButton = styled.label`
  cursor: pointer;
  font-size: 2rem;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s;

  &:hover {
    filter: brightness(1.5);
    transform: scale(1.05) rotate(3deg);
  }
`;

const FileListHorizontal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-left: 5%;
  align-items: center;
  justify-content: start;
  gap: 0.8rem;
`;

const FileItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 95%;
  min-width: 13%;
  transition: all 0.3s;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 4rem;
  width: 5rem;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
`;

const ImagePreview = styled(PreviewContainer)`
  background-size: cover;
  background-position: center;
`;

const VideoPreview = styled(PreviewContainer)`
  background-color: #000;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DocumentPreview = styled(PreviewContainer)`
  background: rgba(0, 0, 0, 0.05);
  justify-content: center;
`;

const FileIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  height: 100%;
`;

const FileName = styled.p`
  margin-top: 0.3rem;
  font-size: 0.7rem;
  max-width: 5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileActions = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;
`;

const FileActionButton = styled.div`
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
    color: var(--primary-color);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--background-color);
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  height: 90%;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
`;

const CloseModalButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--color);
  color: var(--background-color);
  opacity: 0.7;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;

  &:hover {
    opacity: 1;
    transform: rotate(90deg);
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
`;

const ModalVideo = styled.video`
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
`;

const ModalPDF = styled.iframe`
  width: 100%;
  height: 80vh;
  border: none;
  border-radius: 8px;
`;

const ModalTextContent = styled.div`
  text-align: start;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  padding: 1.2rem;
  background: var(--background-color);
  color: var(--color);
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
  border-radius: 4px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 20px;
  font-style: italic;
`;

const UnsupportedType = styled.p`
  padding: 20px;
  text-align: center;
  color: #ff6b6b;
`;

const BottomBar = () => {
  const { t } = useTranslation();
  const { files, setFiles } = useFileNoteStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    objectUrl: string;
    fileType: string;
    file: File;
  } | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles([...files, ...newFiles]);
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
    URL.revokeObjectURL(objectUrl);
  };

  const openModal = async (file: File, objectUrl: string) => {
    const fileType = file.type;
    setSelectedFile({ file, objectUrl, fileType });

    // Reset text content state
    setTextContent(null);

    // Handle text files
    if (fileType.startsWith("text/")) {
      setIsLoadingText(true);
      try {
        const content = await readFileAsText(file);
        setTextContent(content);
      } catch (error) {
        console.error("Error reading text file:", error);
        setTextContent(t("errorReadingFile"));
      } finally {
        setIsLoadingText(false);
      }
    }

    setIsModalOpen(true);
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to read file as text"));
        }
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsText(file);
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setTextContent(null);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const filePreviews = useMemo(() => {
    return files.map((file) => {
      const fileType = file.type;
      const isImage = fileType.startsWith("image/");
      const isVideo = fileType.startsWith("video/");
      const isPdf = fileType === "application/pdf";
      const isText = fileType.startsWith("text/");

      // Only create object URL for files that need it
      const objectUrl =
        isImage || isVideo || isPdf ? URL.createObjectURL(file) : "";

      return { file, objectUrl, isImage, isVideo, isPdf, isText };
    });
  }, [files]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      filePreviews.forEach(({ objectUrl }) => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      });
    };
  }, [filePreviews]);

  return (
    <BottomBarContainer>
      <FileUploadContainer>
        <FileUploadButton htmlFor="file-upload" title={t("addFile")}>
          <FaPlus />
        </FileUploadButton>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
          aria-label={t("addFile")}
        />
      </FileUploadContainer>

      <FileListHorizontal>
        {filePreviews.length > 0 &&
          filePreviews.map(
            ({ file, objectUrl, isImage, isVideo, isPdf, isText }, index) => {
              return (
                <FileItem key={`${index}-${file.name}`}>
                  {isImage ? (
                    <ImagePreview
                      style={{ backgroundImage: `url(${objectUrl})` }}
                      onClick={() => openModal(file, objectUrl)}
                      title={t("clickToPreview")}
                      role="button"
                      aria-label={t("previewImage")}
                    />
                  ) : isVideo ? (
                    <VideoPreview
                      onClick={() => openModal(file, objectUrl)}
                      title={t("clickToPreview")}
                      role="button"
                      aria-label={t("previewVideo")}
                    >
                      <video>
                        <source src={objectUrl} type={file.type} />
                        {t("noVideoSupport")}
                      </video>
                    </VideoPreview>
                  ) : isPdf || isText ? (
                    <DocumentPreview
                      onClick={() => openModal(file, objectUrl)}
                      title={t("clickToPreview")}
                      role="button"
                      aria-label={t("previewDocument")}
                    >
                      <FileIcon>{isPdf ? "📄" : "📝"}</FileIcon>
                    </DocumentPreview>
                  ) : (
                    <DocumentPreview
                      onClick={() => downloadFile(file)}
                      title={t("downloadFile")}
                      role="button"
                      aria-label={t("downloadFile")}
                    >
                      <FileIcon>📦</FileIcon>
                    </DocumentPreview>
                  )}

                  <FileName>{file.name}</FileName>

                  <FileActions>
                    <FileActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      title={t("removeFile")}
                      role="button"
                      aria-label={t("removeFile")}
                    >
                      <FaTrash size={"1em"} />
                    </FileActionButton>
                    <FileActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(file);
                      }}
                      title={t("downloadFile")}
                      role="button"
                      aria-label={t("downloadFile")}
                    >
                      <FaDownload size={"1em"} />
                    </FileActionButton>
                  </FileActions>
                </FileItem>
              );
            },
          )}
      </FileListHorizontal>

      {isModalOpen && selectedFile && (
        <ModalOverlay role="dialog" aria-modal="true">
          <ModalContent ref={modalRef}>
            {selectedFile.fileType.startsWith("image/") && (
              <ModalImage
                src={selectedFile.objectUrl}
                alt={t("imagePreviewAlt")}
              />
            )}

            {selectedFile.fileType.startsWith("video/") && (
              <ModalVideo controls>
                <source
                  src={selectedFile.objectUrl}
                  type={selectedFile.fileType}
                />
                {t("noVideoSupport")}
              </ModalVideo>
            )}

            {selectedFile.fileType === "application/pdf" && (
              <ModalPDF
                src={selectedFile.objectUrl}
                title={t("pdfPreviewTitle")}
              />
            )}

            {selectedFile.fileType.startsWith("text/") && (
              <ModalTextContent>
                {isLoadingText ? (
                  <LoadingText>{t("loading")}</LoadingText>
                ) : textContent ? (
                  <pre>{textContent}</pre>
                ) : (
                  <p>{t("emptyFile")}</p>
                )}
              </ModalTextContent>
            )}

            {!selectedFile.fileType.startsWith("image/") &&
              !selectedFile.fileType.startsWith("video/") &&
              selectedFile.fileType !== "application/pdf" &&
              !selectedFile.fileType.startsWith("text/") && (
                <UnsupportedType>{t("previewNotSupported")}</UnsupportedType>
              )}

            <CloseModalButton
              onClick={closeModal}
              aria-label={t("closePreview")}
            >
              <FaTimes size={"1.2em"} />
            </CloseModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </BottomBarContainer>
  );
};

export default BottomBar;
