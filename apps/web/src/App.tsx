import { AppRouter } from "@/components/router/AppRouter";
import { AppSessionProvider } from "@/providers/app-session-provider";
import { I18nProvider } from "@/providers/i18n-provider";

function App() {
  return (
    <I18nProvider>
      <AppSessionProvider>
        <AppRouter />
      </AppSessionProvider>
    </I18nProvider>
  );
}

export default App;
