import { EOrderType } from "@/src/features/order";
import { sendRequestApi } from "@/src/features/order/api/sendRequest.api";
import { reportGoogleAdsRequestConversion } from "@/src/libs/google-ads";
import { utmStorage } from "@/src/libs/utm-storage";
import NumericFormatPhone from "@/src/shared/ui/number-input/NumericFormatPhone";
import { orderConsultationSchema } from "@/src/validators/order.schema";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  TextField,
} from "@mui/material";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
  email: string;
  name: string;
  phone: string;
};

type SubmitStatus = "idle" | "success" | "error";

export default function SendRequest() {
  const t = useTranslations("common");
  const tRefine = useTranslations("refine");
  const tValidation = useTranslations("validation");

  const pathname = usePathname();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "", name: "", phone: "" },
    resolver: joiResolver(orderConsultationSchema(tValidation)),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await sendRequestApi({
        ...data,
        phone: "380" + data.phone,
        type: EOrderType.CONSULTATION,
        notes: null,
        pageUrl: pathname,
        utmTags: utmStorage.get(),
      });

      reportGoogleAdsRequestConversion({ formType: "consultation" });
      setSubmitStatus("success");
    } catch (error) {
      console.error("Failed to send request:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем сообщение об успехе
  if (submitStatus === "success") {
    return (
      <>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
            gap={2}
          >
            <CheckCircle size={64} color="#4caf50" strokeWidth={1.5} />
            <DialogContentText
              fontSize={20}
              textAlign="center"
              fontWeight={700}
              color="text.primary"
            >
              {t("sendRequest.success.title")}
            </DialogContentText>
            <DialogContentText fontSize={16} textAlign="center">
              {t("sendRequest.success.message")}
            </DialogContentText>
          </Box>
        </DialogContent>
      </>
    );
  }

  if (submitStatus === "error") {
    return (
      <>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
            gap={2}
          >
            <AlertCircle size={64} color="#f44336" strokeWidth={1.5} />
            <DialogContentText
              fontSize={20}
              textAlign="center"
              fontWeight={700}
              color="text.primary"
            >
              {t("sendRequest.error.title")}
            </DialogContentText>
            <DialogContentText fontSize={16} textAlign="center">
              {t("sendRequest.error.message")}
            </DialogContentText>
          </Box>
        </DialogContent>
      </>
    );
  }

  return (
    <>
      <DialogContent>
        <DialogContentText
          fontSize={16}
          textAlign={"center"}
          fontWeight={700}
          color="var(--color-text-g2)"
          mb={1}
        >
          {t("sendRequest.title")}
        </DialogContentText>
        <DialogContentText
          fontSize={16}
          textAlign={"center"}
          mb={2}
          fontStyle={"italic"}
          color="var(--color-text-g3)"
        >
          {t("sendRequest.text")}
        </DialogContentText>
        <Stack
          id="send-request-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: tRefine("common.required_field"),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("sendRequest.fields.email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            rules={{
              required: tRefine("common.required_field"),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("sendRequest.fields.name") + " *"}
                error={!!errors?.name}
                helperText={errors?.name?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            rules={{ required: tRefine("common.required_field") }}
            render={({ field }) => (
              <NumericFormatPhone
                {...field}
                label={t("sendRequest.fields.phone") + " *"}
                error={!!errors?.phone}
                helperText={errors?.phone?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "20px" }}>
        <Button
          type="submit"
          variant="contained"
          form="send-request-form"
          startIcon={<Send />}
          loading={isLoading}
        >
          {t("sendRequest.button.send")}
        </Button>
      </DialogActions>
    </>
  );
}
