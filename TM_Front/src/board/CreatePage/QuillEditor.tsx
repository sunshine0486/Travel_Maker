import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { ImageResize } from "quill-image-resize-module-ts"; // 리사이즈
import { getImgUrl } from "../boardApi";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import "./QuillEditor.css";
import {
  ALLOWED_EXTENSIONS,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
  type FileItem,
} from "../../ts/type";
import { formatSize } from "../../ts/format";

type QuillEditorProps = {
  initialContent?: string;
  onSubmit?: (content: string, files: FileItem[]) => void;
  initialFiles?: FileItem[]; // 수정용
  page?: "new" | "edit";
};

export type QuillEditorHandle = {
  getContent: () => string;
  getFiles: () => FileItem[];
};

// window 타입 확장
declare global {
  interface Window {
    Quill: typeof Quill;
  }
}

if (typeof window !== "undefined" && window.Quill) {
  window.Quill = Quill;
} //Quill을 window 전역 객체에 할당하여 전역으로 사용

// 리사이즈 Quill 모듈을 등록
Quill.register("modules/imageResize", ImageResize);

// export default function QuillEditor({
//   // initialContent = "",
//   onSubmit,
// }: QuillEditorProps) {
export const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(
  ({ initialContent = "", initialFiles = [] }, ref) => {
    const quillRef = useRef<ReactQuill | null>(null);
    const [files, setFiles] = useState<FileItem[]>(initialFiles);
    const [toastOpen, setToastOpen] = useState(false);

    // 개인정보 마스킹 (사진넣으면 안되고, 한번 마스킹하면 안됨.)
    useEffect(() => {
      const interval = setInterval(() => {
        if (quillRef.current && quillRef.current.getEditor) {
          const quill = quillRef.current.getEditor();
          clearInterval(interval); // 에디터가 준비되면 interval 제거

          const phoneRegex = /\b(\d{2,3})-(\d{3,4})-(\d{4})\b/g;
          const rrnRegex = /\b(\d{6})-(\d{7})\b/g;
          const isMasking = { current: false }; // 플래그

          const handleTextChange = () => {
            if (isMasking.current) return;
            const quill = quillRef.current!.getEditor();
            const text = quill.getText();

            const phoneMatches = [...text.matchAll(phoneRegex)];
            const rrnMatches = [...text.matchAll(rrnRegex)];

            if (phoneMatches.length === 0 && rrnMatches.length === 0) return;

            isMasking.current = true;
            phoneMatches.forEach((m) => {
              const index = m.index!;
              quill.deleteText(index, m[0].length);
              quill.insertText(index, "***-****-****");
            });
            rrnMatches.forEach((m) => {
              const index = m.index!;
              quill.deleteText(index, m[0].length);
              quill.insertText(index, "******-*******");
            });
            isMasking.current = false;
            setToastOpen(true);
          };

          quill.on("text-change", handleTextChange);
          return () => quill.off("text-change", handleTextChange);
        }
      }, 100);

      return () => clearInterval(interval);
    }, []);

    // content랑 files newboard에 넘기기
    useImperativeHandle(ref, () => ({
      getContent: () => quillRef.current?.getEditor().root.innerHTML || "",
      getFiles: () => files,
    }));

    //동작: 이미지 버튼 클릭 → 파일 선택 → 서버 업로드 → 에디터 삽입
    const imageHandler = () => {
      if (!quillRef.current) return;
      const quillInstance: Quill = quillRef.current.getEditor();

      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      // 이미지 클릭 시 파일 선택창이 나타남
      input.onchange = async () => {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];

        // 개수 제한
        if (files.length >= MAX_FILE_COUNT) {
          alert(`첨부 파일은 최대 ${MAX_FILE_COUNT}개까지 가능합니다.`);
          return;
        }

        // 확장자 체크
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
          alert(`허용되지 않은 확장자입니다`);
        }

        // 용량 체크
        if (file.size > MAX_FILE_SIZE) {
          alert(`파일 용량은 최대 ${MAX_FILE_COUNT}까지 가능합니다.`);
          return;
        }

        try {
          // 서버에 업로드 → URL 반환
          const imgUrl = `/api${await getImgUrl(file)}`;

          // 에디터에 이미지 삽입
          const range = quillInstance.getSelection(true);
          if (range) {
            // 받아온 url을 이미지 태그에 삽입
            quillInstance.insertEmbed(range.index, "image", imgUrl);
            // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
            quillInstance.setSelection(range.index + 1);
          }
          // 파일 목록에도 추가
          setFiles((prev) => [
            ...prev,
            { name: file.name, size: file.size, type: file.type, file },
          ]);
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
        }
      };
    };

    // 일반 파일 첨부
    const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const newFiles: FileItem[] = [];

      for (const file of e.target.files) {
        if (files.length + newFiles.length >= MAX_FILE_COUNT) {
          alert(`첨부 파일은 최대 ${MAX_FILE_COUNT}개까지 가능합니다.`);
          e.target.value = "";
          return;
        }

        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
          alert(`허용되지 않은 확장자입니다`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          alert(`파일 용량은 최대 ${MAX_FILE_COUNT}까지 가능합니다.`);
          continue;
        }

        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file,
        });
      }

      if (newFiles.length > 0) setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    };

    // 선택된 파일 리스트에서 제거
    const handleFileRemove = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // 모듈
    const modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          [
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            { color: [] },
          ],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "+1" },
            { align: [] },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler, // 기본 image 버튼 대신 서버 업로드 핸들러
        },
      },
      imageResize: {
        modules: ["Resize", "DisplaySize"],
      },
    };

    return (
      <>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          style={{ width: "750px", height: "500px" }}
          placeholder="내용을 입력해주세요..."
          modules={modules}
        />
        <br></br>

        {/* 파일 선택 버튼 */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: "text.primary",
              borderColor: "text.primary",
              textTransform: "none",
              width: "15%",
            }}
          >
            파일 선택
            <input type="file" hidden multiple onChange={handleFileAdd} />
          </Button>

          {/* 오른쪽 안내 문구 */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              ml: 2, // 버튼과 간격
              textAlign: "left",
            }}
          >
            파일 개수는 <b>최대 {MAX_FILE_COUNT}개</b>, 각 파일
            <b> 최대 {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB</b>까지
            가능합니다.
            <br /> 허용 확장자 : <b>{ALLOWED_EXTENSIONS.join(", ")}</b>
          </Typography>
        </Box>

        <Stack spacing={1} mt={2}>
          {files.map((f, idx) => (
            <Card key={idx} variant="outlined">
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  {f.name} ({formatSize(f.size)})
                </Typography>
                <IconButton onClick={() => handleFileRemove(idx)}>
                  <ClearIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Snackbar
          open={toastOpen}
          autoHideDuration={2000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // 상단 중앙
        >
          <Alert
            severity="error" // 빨간색
            sx={{ width: "auto", minWidth: 300, textAlign: "center" }} // 가로 최소 너비, 텍스트 중앙
          >
            개인정보가 감지되어 마스킹됩니다.
          </Alert>
        </Snackbar>

        {/* <Button onClick={handleSubmit}>
        {page === "new" ? "작성 완료" : "수정 완료"}
      </Button> */}
      </>
    );
  }
);

// import {
//   forwardRef,
//   useEffect,
//   useImperativeHandle,
//   useRef,
//   useState,
// } from "react";
// import ReactQuill, { Quill } from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";
// import { ImageResize } from "quill-image-resize-module-ts";
// import { getImgUrl } from "../boardApi";
// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   IconButton,
//   Snackbar,
//   Stack,
//   Typography,
// } from "@mui/material";
// import ClearIcon from "@mui/icons-material/Clear";
// import {
//   ALLOWED_EXTENSIONS,
//   MAX_FILE_COUNT,
//   MAX_FILE_SIZE,
//   type FileItem,
// } from "../type";

// type QuillEditorProps = {
//   value: string;
//   onChange?: (content: string) => void;
//   initialFiles?: FileItem[];
//   page?: "new" | "edit";
//   onSubmit: (content: string, files: FileItem[]) => void;
// };

// export type QuillEditorHandle = {
//   getContent: () => string;
//   getFiles: () => FileItem[];
// };

// // Quill window 전역
// declare global {
//   interface Window {
//     Quill: typeof Quill;
//   }
// }
// if (typeof window !== "undefined" && window.Quill) {
//   window.Quill = Quill;
// }
// Quill.register("modules/imageResize", ImageResize);

// const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(
//   ({ value, onChange, initialFiles = [] }, ref) => {
//     const quillRef = useRef<ReactQuill | null>(null);
//     const [files, setFiles] = useState<FileItem[]>(initialFiles);
//     const [toastOpen, setToastOpen] = useState(false);

//     // initialFiles가 바뀌면 files 상태 업데이트
//     useEffect(() => {
//       setFiles(initialFiles);
//     }, [initialFiles]);

//     // content랑 files newboard에 넘기기
//     useImperativeHandle(ref, () => ({
//       getContent: () => quillRef.current?.getEditor().root.innerHTML || "",
//       getFiles: () => files,
//     }));

//     const imageHandler = () => {
//       if (!quillRef.current) return;
//       const quillInstance: Quill = quillRef.current.getEditor();

//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = "image/*";
//       input.click();

//       input.onchange = async () => {
//         if (!input.files || input.files.length === 0) return;
//         const file = input.files[0];

//         if (files.length >= MAX_FILE_COUNT) {
//           alert(`첨부 파일은 최대 ${MAX_FILE_COUNT}개까지 가능합니다.`);
//           return;
//         }

//         const ext = file.name.split(".").pop()?.toLowerCase();
//         if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
//           alert(`허용되지 않은 확장자입니다`);
//           return;
//         }

//         if (file.size > MAX_FILE_SIZE) {
//           alert(
//             `파일 용량은 최대 ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(
//               0
//             )}MB까지 가능합니다.`
//           );
//           return;
//         }

//         try {
//           const imgUrl = `/api${await getImgUrl(file)}`;
//           const range = quillInstance.getSelection(true);
//           if (range) {
//             quillInstance.insertEmbed(range.index, "image", imgUrl);
//             quillInstance.setSelection(range.index + 1);
//           }
//           setFiles((prev) => [
//             ...prev,
//             { name: file.name, size: file.size, type: file.type, file },
//           ]);
//         } catch (error) {
//           console.error("이미지 업로드 실패:", error);
//         }
//       };
//     };

//     const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
//       if (!e.target.files) return;
//       const newFiles: FileItem[] = [];

//       for (const file of e.target.files) {
//         if (files.length + newFiles.length >= MAX_FILE_COUNT) {
//           alert(`첨부 파일은 최대 ${MAX_FILE_COUNT}개까지 가능합니다.`);
//           e.target.value = "";
//           return;
//         }
//         const ext = file.name.split(".").pop()?.toLowerCase();
//         if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
//           alert(`허용되지 않은 확장자입니다`);
//           continue;
//         }
//         if (file.size > MAX_FILE_SIZE) {
//           alert(
//             `파일 용량은 최대 ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(
//               0
//             )}MB까지 가능합니다.`
//           );
//           continue;
//         }
//         newFiles.push({
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           file,
//         });
//       }

//       if (newFiles.length > 0) setFiles((prev) => [...prev, ...newFiles]);
//       e.target.value = "";
//     };

//     const handleFileRemove = (index: number) => {
//       setFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     const modules = {
//       toolbar: {
//         container: [
//           [{ header: [1, 2, 3, 4, 5, false] }],
//           [
//             "bold",
//             "italic",
//             "underline",
//             "strike",
//             "blockquote",
//             { color: [] },
//           ],
//           [
//             { list: "ordered" },
//             { list: "bullet" },
//             { indent: "+1" },
//             { align: [] },
//           ],
//           ["link", "image", "video"],
//           ["clean"],
//         ],
//         handlers: {
//           image: imageHandler,
//         },
//       },
//       imageResize: { modules: ["Resize", "DisplaySize"] },
//     };

//     const formatSize = (size: number) =>
//       size < 1024 * 1024
//         ? `${(size / 1024).toFixed(2)} KB`
//         : `${(size / 1024 / 1024).toFixed(2)} MB`;

//     return (
//       <>
//         <ReactQuill
//           ref={quillRef}
//           theme="snow"
//           value={value}
//           onChange={onChange}
//           style={{ width: "750px", height: "500px" }}
//           modules={modules}
//           placeholder="내용을 입력해주세요..."
//         />
//         <br></br> {/* 파일 선택 버튼 */}
//         <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
//           <Button
//             variant="outlined"
//             component="label"
//             sx={{
//               color: "text.primary",
//               borderColor: "text.primary",
//               textTransform: "none",
//               width: "15%",
//             }}
//           >
//             파일 선택
//             <input type="file" hidden multiple onChange={handleFileAdd} />
//           </Button>
//           <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
//             파일 개수는 <b>최대 {MAX_FILE_COUNT}개</b>, 각 파일{" "}
//             <b> 최대 {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB</b>까지
//             가능합니다. <br /> 허용 확장자 :{" "}
//             <b>{ALLOWED_EXTENSIONS.join(", ")}</b>{" "}
//           </Typography>{" "}
//         </Box>
//         <Stack spacing={1} mt={2}>
//           {files.map((f, idx) => (
//             <Card key={idx} variant="outlined">
//               <CardContent
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Typography variant="body2">
//                   {f.name} ({formatSize(f.size)})
//                 </Typography>
//                 <IconButton onClick={() => handleFileRemove(idx)}>
//                   <ClearIcon />
//                 </IconButton>
//               </CardContent>
//             </Card>
//           ))}
//         </Stack>
//         <Snackbar
//           open={toastOpen}
//           autoHideDuration={2000}
//           onClose={() => setToastOpen(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert severity="error" sx={{ minWidth: 300, textAlign: "center" }}>
//             개인정보가 감지되어 마스킹됩니다.
//           </Alert>
//         </Snackbar>
//       </>
//     );
//   }
// );

// export default QuillEditor;
