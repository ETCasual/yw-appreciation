/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  type FunctionComponent,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { Formik, Form, Field } from "formik";
import { sendFetch, uploadFile } from "../helpers/uploadFile";
import { Oval } from "react-loader-spinner";
import * as Yup from "yup";
import { AiOutlineSave } from "react-icons/ai";
import { toJpeg } from "html-to-image";
import { toast } from "react-toastify";
import { useUser } from "@/stores/useUser";
import { useRouter } from "next/router";

interface EnvelopeProps {
  hint?: boolean;
  sending?: boolean;
  message?: string;
  image?: string | null;
  id?: string;
  setModalOpen?: Dispatch<SetStateAction<boolean>>;
}

export const Envelope: FunctionComponent<EnvelopeProps> = ({
  hint: hintDefault,
  sending,
  message,
  image,
  id,
  setModalOpen,
}) => {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(hintDefault);
  const [file, setFile] = useState<File | undefined>();
  const [shareContent, setShareContent] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const { number } = useUser();
  const router = useRouter();
  return (
    <div
      className={`envelope${
        open ? " open" : " new cursor-pointer"
      } h-[250px] w-[325px] sm:h-[265px] sm:w-[370px] sm:max-w-[380px] lg:h-[300px] lg:w-[450px] lg:max-w-none 3xl:h-[366.66667px] 3xl:w-[550px] 3xl:max-w-none`}
      onClick={async () => {
        if (!number && sending) {
          setModalOpen?.(true);
          return;
        }
        setOpen(true);
        setHint(false);

        if (!sending) {
          await fetch("/api/updateSeen", {
            method: "POST",
            body: JSON.stringify({ id: id }),
          });
        }
      }}
    >
      <div className="back">
        {hint && (
          <div className="absolute left-1/2 top-1/3 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 animate-pulse flex-col items-center justify-center text-black">
            <p className="font-chi text-2xl font-bold">
              {!sending ? "点击打开" : number ? "点击打开" : "请先登入"}
            </p>
            <p className="font-en text-lg">
              {!sending
                ? "Click to open"
                : number
                  ? "Click to open"
                  : "Please login first"}
            </p>
          </div>
        )}

        <div
          className={`letter ${
            generatingImage
              ? "static h-[65dvh]"
              : "h-[245px] w-[305px] sm:h-[260px] sm:w-[350px] lg:h-[290px] lg:w-[430px] 3xl:h-[346.66667px] 3xl:w-[530px]"
          }`}
        >
          {/* <h2>XX：</h2>
          <h3>XXXXXXX！</h3>
          <img
            src="https://medibangpaint.com/wp-content/uploads/2021/08/0.png"
            width="50%"
            height="50%"
          /> */}

          {sending ? (
            <Formik<{
              to: string;
              message: string;
            }>
              initialValues={{
                to: "",
                message: "",
              }}
              validationSchema={Yup.object().shape({
                to: Yup.string().required("Required."),
                message: Yup.string().required("Required."),
              })}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true);
                const id = toast.loading("卡片上传中... ");
                if (file) {
                  await uploadFile(file).then(async (data) => {
                    await sendFetch(
                      values.to,
                      values.message,
                      `https://ywkl-image-storage.s3.ap-southeast-1.amazonaws.com/${data}`,
                    ).then(async (rt) => {
                      await rt.json().then((share) => {
                        toast.update(id, {
                          render: "卡片上传成功! 🎉",
                          type: "success",
                          isLoading: false,
                          autoClose: 2500,
                        });
                        setShareContent(share.id);
                        actions.setSubmitting(false);
                        actions.resetForm();
                      });
                    });
                  });
                } else {
                  await sendFetch(values.to, values.message, "").then(
                    async (rt) => {
                      await rt.json().then((share) => {
                        toast.update(id, {
                          render: "卡片上传成功! 🎉",
                          type: "success",
                          isLoading: false,
                          autoClose: 2500,
                        });
                        setShareContent(share.id);
                        actions.setSubmitting(false);
                        actions.resetForm();
                      });
                    },
                  );
                }
              }}
            >
              {({ isSubmitting, errors }) =>
                shareContent ? (
                  <div className="flex h-full flex-col items-center justify-center text-white">
                    <p className="px-3 text-center font-chi text-lg font-bold">
                      写多一封给你爱的他/她吧!
                    </p>
                    <p className="px-3 text-center font-en">
                      Write another letter to your loved ones!
                    </p>
                    <button
                      className="mt-2 rounded-2xl border-[1px] border-blue-100 bg-blue-200 px-4 py-1 font-en text-xs text-black/80 lg:px-4 lg:text-base"
                      onClick={() => {
                        setShareContent("");
                        setFile(undefined);
                      }}
                    >
                      <span className="font-chi font-bold">返回</span> Back
                    </button>
                  </div>
                ) : (
                  <Form className="relative flex h-full flex-grow flex-col gap-2 p-3 text-xs md:px-4 md:py-3 lg:text-base">
                    {isSubmitting && (
                      <div className="absolute inset-0 flex flex-row items-center justify-center bg-white/50">
                        <Oval
                          visible={true}
                          height="50"
                          width="50"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    )}

                    <div className="flex flex-row gap-x-2">
                      <label
                        htmlFor="to"
                        className="flex min-w-[80px] flex-col items-start font-en text-white 3xl:w-[145px]"
                      >
                        <span className="font-chi font-bold">
                          收信者 <span className="font-en">To</span>
                        </span>
                        <span className="font-chi text-[10px]">
                          (电话号码 <span className="font-en">Phone</span>)
                        </span>
                      </label>
                      <Field
                        className={`${
                          errors.message ? "border border-red-500 " : ""
                        }font-chi w-full px-0.5 font-bold`}
                        name="to"
                        disabled={isSubmitting}
                        id="to"
                        onPaste={(e: ClipboardEvent) => {
                          if (!e.clipboardData) return;
                          const pasteData = e.clipboardData.getData("Text");
                          // Allow only digits
                          if (!/^\d*$/.test(pasteData)) {
                            e.preventDefault();
                          }
                        }}
                        onKeyDown={(e: KeyboardEvent) => {
                          if (
                            e.key === "e" ||
                            e.key === "+" ||
                            e.key === "-" ||
                            e.key === "."
                          )
                            e.preventDefault();
                        }}
                      />
                    </div>
                    <div className="flex flex-grow flex-row gap-x-2">
                      <label
                        htmlFor="message"
                        className="min-w-[80px] font-en text-white 3xl:w-[145px]"
                      >
                        <span className="font-chi font-bold">
                          内容
                          <br />
                        </span>{" "}
                        Message
                      </label>
                      <Field
                        className={`${
                          errors.message ? "border border-red-500 " : ""
                        }font-chi flex-grow resize-none px-0.5 font-bold`}
                        name="message"
                        disabled={isSubmitting}
                        id="message"
                        as="textarea"
                      />
                    </div>
                    <div className="flex flex-row gap-x-2">
                      <div className="w-[80px] 3xl:w-[145px]" />
                      <input
                        name={"img"}
                        disabled={isSubmitting}
                        type="file"
                        id="img"
                        onChange={(e) => setFile(e.target.files?.[0])}
                        className={`hidden`}
                        accept="image/png, image/jpeg, image/jpg"
                      />
                      {file ? (
                        <label htmlFor="img">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-[75px] object-cover"
                          />
                        </label>
                      ) : (
                        <label
                          htmlFor="img"
                          className="flex-grow cursor-pointer rounded-full bg-white py-1 text-center font-en text-black"
                        >
                          <span className="font-chi font-bold">添加照片</span>{" "}
                          Add a Picture
                        </label>
                      )}
                    </div>
                    <button
                      disabled={isSubmitting}
                      className="flex flex-row justify-center bg-gradient-to-br from-[#fcfcfc] to-[#f4f5f5] py-1 font-en disabled:opacity-70 3xl:text-lg"
                    >
                      {isSubmitting ? (
                        <Oval
                          visible={true}
                          height="20"
                          width="20"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      ) : (
                        <>
                          <span className="font-chi font-bold">发送</span> Send
                        </>
                      )}
                    </button>
                  </Form>
                )
              }
            </Formik>
          ) : (
            <div className="relative flex h-full w-full flex-col px-2 py-1 text-white md:px-4 md:py-3">
              <p className="w-full text-center font-chi text-lg">
                嘿，想对你说...
              </p>

              <div
                className={`flex h-full ${
                  generatingImage ? "flex-col items-center" : "flex-row"
                } gap-x-2 p-1 lg:gap-x-5 lg:p-2`}
              >
                {image && (
                  <img
                    src={`/api/convertImage/${encodeURIComponent(image)}`}
                    className={`${
                      !generatingImage
                        ? "w-[110px] lg:w-[130px]"
                        : "h-[200px] w-full lg:h-[250px]"
                    } object-cover`}
                    alt={"image"}
                  />
                )}
                {!generatingImage && image && (
                  <div className="h-full w-[1px] bg-gray-400" />
                )}
                <div
                  className={`w-full ${
                    generatingImage ? "overflow-hidden" : "overflow-y-scroll"
                  }`}
                >
                  {message?.split("\n").map((m, i) => (
                    <p className="font-chi text-sm lg:text-xl" key={i}>
                      {m}
                    </p>
                  ))}
                </div>
              </div>
              {open ? (
                <div className="absolute bottom-0 flex w-full translate-y-[calc(100%+12px)] flex-row items-center justify-between pr-5 lg:bottom-3 lg:pr-8">
                  <button
                    onClick={async () => {
                      if (generatingImage) return;
                      const id = toast.loading("图片生成中... 📸");
                      setGeneratingImage(true);
                      setTimeout(
                        () =>
                          void toJpeg(document.getElementById("main")!, {
                            quality: 1,
                            // height: 1080,
                            // width: 608,
                          })
                            .then(async () => {
                              await toJpeg(document.getElementById("main")!, {
                                quality: 1,
                              }).then(function (dataUrl: string) {
                                const link = document.createElement("a");
                                const name = `${id}.jpeg`
                                  .replaceAll(" ", "-")
                                  .replaceAll("/", "_");
                                link.download = name;
                                link.href = dataUrl;
                                toast.update(id, {
                                  render: "图片生成成功! 🎉",
                                  type: "success",
                                  isLoading: false,
                                  autoClose: 2500,
                                });
                                link.click();
                                setGeneratingImage(false);
                              });
                            })

                            .catch((err: unknown) => console.log(err)),
                        500,
                      );
                    }}
                    className={`${
                      generatingImage ? "opacity-0 " : ""
                    }flex flex-row items-center gap-1 rounded-2xl border-[1px] border-blue-100 bg-blue-400 bg-opacity-70 px-2 py-1 transition-all duration-300 hover:bg-opacity-100`}
                  >
                    <AiOutlineSave className="text-[16px] lg:text-[21px]" />
                    <p className="font-en text-xs text-black">
                      <span className="font-chi font-bold">储存卡片</span> Save
                      Card
                    </p>
                  </button>
                  <button
                    className={`rounded-2xl border-[1px] border-blue-100 bg-blue-200 px-4 py-1 font-en text-xs text-black/80 lg:px-4 lg:text-base${
                      generatingImage ? " opacity-0" : ""
                    }`}
                    onClick={async () => {
                      await router.push("/");
                    }}
                  >
                    <span className="font-chi font-bold">返回</span> Back
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
        <div
          className={`${
            generatingImage ? "opacity-0 " : ""
          }flap left-flap before:-top-[5px] before:h-[300px] before:w-[300px] before:sm:h-[388.90873px] before:sm:w-[388.90873px] before:lg:h-[275px] before:lg:w-[275px] before:3xl:h-[269.27249px] before:3xl:w-[269.27249px]`}
        ></div>
        <div
          className={`${
            generatingImage ? "opacity-0 " : ""
          }flap right-flap before:-top-[5px] before:h-[300px] before:w-[300px] before:sm:h-[388.90873px] before:sm:w-[388.90873px] before:lg:h-[275px] before:lg:w-[275px] before:3xl:h-[269.27249px] before:3xl:w-[269.27249px]`}
        ></div>
        <div
          className={`${
            generatingImage ? "opacity-0 " : ""
          }flap bottom-flap before:h-[470px] before:w-[370px] before:rounded-tl-[25px] before:sm:h-[650px] before:sm:w-[650px] before:lg:h-[800px] before:lg:w-[820px] before:lg:rounded-tl-[50px] before:3xl:h-[388.90873px] before:3xl:w-[388.90873px]`}
        ></div>
        <div
          className={`${
            generatingImage ? "opacity-0 " : ""
          }flap top-flap before:h-[230px] before:w-[230px] before:sm:h-[263.27249px] before:sm:w-[263.27249px] before:lg:h-[318px] before:lg:w-[318px] before:3xl:h-[388.90873px] before:3xl:w-[388.90873px]`}
        ></div>
      </div>
    </div>
  );
};
