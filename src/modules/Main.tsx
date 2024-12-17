/* eslint-disable @next/next/no-img-element */
import { Envelope } from "@/components/Envelope";
import { useUser } from "@/stores/useUser";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { type Card } from "@prisma/client";
import { useRouter } from "next/router";

type ReturnedData = { card: Card[] };
function MainPage() {
  const { number, setNumber } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inboxData, setInboxData] = useState<Card[]>([]);

  useEffect(() => {
    const intervalFetch = async () => {
      const res = await fetch(`/api/getCards/${number}`);
      await res.json().then((data: ReturnedData) => {
        if (!data) return;
        setInboxData(data.card);
      });
    };

    void intervalFetch();

    const int = setInterval(() => void intervalFetch(), 5000);

    return () => clearInterval(int);
  }, [number]);

  const inboxCount = inboxData
    ? inboxData.filter((data) => !data.seen).length
    : 0;

  const router = useRouter();
  return (
    <>
      <Modal
        isOpen={modalOpen}
        placement="center"
        className="dark"
        onClose={() => setModalOpen(false)}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row items-end gap-1 font-chi text-white">
                电话号码 <span className="font-en">Phone number</span>
              </ModalHeader>
              <ModalBody>
                <Formik<{ phone: string }>
                  initialValues={{ phone: number }}
                  onSubmit={(value) => {
                    setNumber(value.phone);
                    setModalOpen(false);
                  }}
                  validationSchema={Yup.object().shape({
                    phone: Yup.string().required("Required.").min(10).max(11),
                  })}
                >
                  {({ setFieldValue, errors, values }) => (
                    <Form className="flex flex-col">
                      <input
                        type="number"
                        onKeyDown={(e) => {
                          if (
                            e.key === "e" ||
                            e.key === "+" ||
                            e.key === "-" ||
                            e.key === "."
                          )
                            e.preventDefault();
                        }}
                        onChange={async (e) => {
                          await setFieldValue("phone", e.target.value);
                        }}
                        onPaste={(e) => {
                          if (!e.clipboardData) return;
                          const pasteData = e.clipboardData.getData("Text");
                          // Allow only digits
                          if (!/^\d*$/.test(pasteData)) {
                            e.preventDefault();
                          }
                        }}
                        value={values.phone}
                        placeholder="0123456789"
                        name="phone"
                        className={`rounded-xl bg-white/70 px-2 py-1 placeholder:text-black/30 ${
                          errors.phone
                            ? "border-2 border-red-500 placeholder:text-red-500"
                            : null
                        }`}
                      ></input>

                      <div className="mt-1 flex flex-col items-end">
                        <span className="self-end text-right font-chi text-xs italic text-white">
                          * 请按照提供的格式填写.
                        </span>
                        <span className="self-end text-right font-en text-[10px] italic text-white">
                          * Please follow the given format.
                        </span>
                      </div>
                      <button
                        type="submit"
                        className="mt-3 rounded-2xl bg-green-400 px-4 py-1 text-center font-chi text-xs font-bold lg:px-7 lg:text-base"
                      >
                        确认 Confirm
                      </button>
                    </Form>
                  )}
                </Formik>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={inboxOpen}
        placement="bottom-center"
        scrollBehavior="inside"
        className="dark"
        onClose={() => setInboxOpen(false)}
      >
        <ModalContent className="flex flex-col gap-1">
          {() => (
            <>
              <ModalHeader className="flex flex-row items-end gap-1 font-chi text-white">
                信箱 <span className="font-en">Inbox</span>
              </ModalHeader>
              <ModalBody>
                {inboxData
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((data) => {
                    return (
                      <button
                        onClick={() => router.push(`/${data.id}`)}
                        key={data.id}
                        className={`${
                          data.seen ? "opacity-50" : ""
                        } flex w-full flex-row items-center gap-2 rounded-xl bg-white/80 p-3 text-sm`}
                      >
                        {data.image ? (
                          <img
                            className="h-[25px] w-[25px] rounded-full object-cover"
                            alt=""
                            src={data.image}
                          />
                        ) : (
                          <img
                            className="h-[25px] w-[25px] rounded-full object-cover"
                            alt=""
                            src={"/yw_logo.png"}
                          />
                        )}
                        <p className="line-clamp-2 w-full  text-left text-xs">
                          {data.message}
                        </p>
                      </button>
                    );
                  })}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <main className="flex h-[100dvh] w-screen flex-col items-center bg-[url('/TG_BG.jpg')] bg-cover bg-center bg-no-repeat py-10 3xl:py-16">
        <img
          src="/YW_Title.png"
          className="w-[170px] object-cover lg:w-[230px] 2xl:w-[270px]"
        />

        <div className="mt-4 flex w-[70%] flex-row items-start gap-2 rounded-[2rem] border-2 border-[#a200ff] bg-black p-2">
          {number ? (
            <button
              onClick={() => setModalOpen(true)}
              className="w-full rounded-2xl bg-purple-700/70 px-4 py-1 text-center text-xs text-white"
            >
              {number}
            </button>
          ) : (
            <button
              className="w-full rounded-2xl bg-green-400 px-4 py-1 text-center font-chi text-xs lg:px-7 lg:text-base"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              登入 <span className="font-en">Login</span>
            </button>
          )}
          <button
            className="relative w-full rounded-2xl bg-blue-400 px-4 py-1 text-center font-chi text-xs lg:px-7 lg:text-base"
            onClick={() => setInboxOpen(true)}
          >
            {inboxCount ? (
              <div className="absolute -top-1/2 right-0 h-[16px] w-[16px] translate-x-1/4 translate-y-1/2 rounded-full bg-red-600 font-[Arial] text-[10px] text-white">
                {inboxCount}
              </div>
            ) : null}
            信箱 <span className="font-en">Inbox</span>
          </button>
        </div>
        <Envelope setModalOpen={setModalOpen} hint sending />

        <div className="text-shadow absolute bottom-[16.5%] left-1/2 flex w-full -translate-x-1/2 flex-col text-white lg:bottom-10 3xl:bottom-20">
          <p className="w-full text-center font-chi text-2xl lg:text-4xl">
            写一段感恩的话语
            <br />
            再把它发给你想感恩的人
          </p>

          <p className="w-[75%] self-center text-center font-en text-sm lg:text-lg">
            Write a appreciation message to someone.
          </p>
        </div>
      </main>
    </>
  );
}

export default MainPage;
