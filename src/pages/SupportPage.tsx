import { Formik, FormikHelpers, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const SupportPage = () => {
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { t, i18n } = useTranslation();
  const { userSettings } = useAuth();

  useEffect(() => {
    if (userSettings?.language) {
      i18n.changeLanguage(userSettings.language);
    }
  }, [userSettings, i18n]);

  const initialValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("name_required")),
    email: Yup.string()
      .email(t("email_invalid"))
      .required(t("email_required")),
    subject: Yup.string().required(t("subject_required")),
    message: Yup.string().required(t("message_required")),
  });

  const handleSubmit = (
    values: typeof initialValues,
    helpers: FormikHelpers<{ name: string; message: string }>
  ) => {
    setIsSending(true);

    const serviceID = "service_adqn9uo";
    const templateID = "template_cz8xreq";
    const publicKey = "tMcR_SLbo1jZiNx9D";

    emailjs
      .send(serviceID, templateID, values, publicKey)
      .then(() => {
        setSent(true);
        helpers.resetForm();
      })
      .catch((error) => {
        console.error("Помилка надсилання:", error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="bg-black mt-[190px] min-h-screen px-6 py-10 md:px-10 border-b-4 border-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto border-l-4 border-lime-500 pl-6"
      >
        <h1
          className="text-3xl md:text-4xl font-bold text-lime-400 mb-6 tracking-wider uppercase font-mono
            relative before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50
            before:transform before:transition-transform before:duration-300 hover:before:scale-x-110"
        >
          {t("support")}
        </h1>

        {!sent ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-6">
              {["name", "email", "subject", "message"].map((field) => (
                <div key={field}>
                  <label className="block text-lime-400 text-sm uppercase tracking-wide mb-1 font-mono">
                    {t(field)}
                  </label>
                  {field !== "message" ? (
                    <Field
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm text-sm uppercase font-mono
                        focus:outline-none focus:border-lime-500 transition-all duration-300"
                    />
                  ) : (
                    <Field
                      as="textarea"
                      rows={5}
                      name="message"
                      className="w-full px-4 py-2 bg-neutral-900/50 border border-lime-500/50 text-lime-400 rounded-sm text-sm uppercase font-mono
                        resize-none focus:outline-none focus:border-lime-500 transition-all duration-300"
                    />
                  )}
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="text-red-500 text-xs mt-1 uppercase font-mono"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSending}
                className="bg-lime-500/10 border border-lime-500 text-lime-400 text-sm px-6 py-2 rounded-sm uppercase font-mono
                  hover:bg-lime-500 hover:text-black transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                {isSending ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-lime-400 border-t-transparent"></span>
                ) : (
                  t("submit")
                )}
              </button>
            </Form>
          </Formik>
        ) : (
          <div className="text-lime-400 mt-10 text-lg uppercase tracking-wide font-mono">
            {t("support_success")}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SupportPage;