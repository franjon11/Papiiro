import { useMsgAlerts } from "../messages/useMsgAlerts";
import { useMsgLogger } from "../messages/useMsgLogger";
import { TelegramService } from "../services/telegram";
import { AlertErrorType, AlertInfoType, AlertSuccessType, AlertType, AnalysisType, GastoExtraido } from "../types";

interface UseHandlerLoggerProps {
  telegram: TelegramService;
}

interface HandlerShowInfoProps {
  type: AlertInfoType
  chatId?: number
  gasto?: GastoExtraido
  typeAnalysis?: AnalysisType
}

interface HandlerShowSuccessProps {
  type: AlertSuccessType
  chatId?: number
  gasto?: GastoExtraido
}

interface HandlerShowErrorProps {
  type: AlertErrorType
  chatId?: number
  error?: unknown
}

export const useHandlerLogger = ({ telegram }: UseHandlerLoggerProps) => {
  const { logMsg } = useMsgLogger();
  const { showMsg } = useMsgAlerts(telegram);

  const logWithGasto = async (type: AlertType, gasto: GastoExtraido, chatId?: number) => {
    logMsg({ type: type, gasto })
    if (chatId) await showMsg({ chatId, type: type, gasto });
  }

  const logWithoutGasto = async (type: AlertType, chatId?: number) => {
    logMsg({ type: type })
    if (chatId) await showMsg({ chatId, type: type });
  }

  const handlerShowError = async ({ type, error, chatId }: HandlerShowErrorProps) => {
    if (error) logMsg({ type: type, error });
    if (chatId) await showMsg({ chatId, type: type });
  }

  const handlerShowInfo = async ({ type, chatId, gasto }: HandlerShowInfoProps) => {
    if (gasto) await logWithGasto(type, gasto, chatId)
    else await logWithoutGasto(type, chatId)
  } 

  const handlerShowSuccess = async ({ type, chatId, gasto }: HandlerShowSuccessProps) => {
    if (gasto) await logWithGasto(type, gasto, chatId)
    else await logWithoutGasto(type, chatId)
  } 

  return { handlerShowError, handlerShowInfo, handlerShowSuccess };
}
