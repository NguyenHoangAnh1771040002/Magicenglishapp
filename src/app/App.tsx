import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { MagicVocab } from "./components/MagicVocab";
import { GrammarChecker } from "./components/GrammarChecker";
import { StatsStreaks } from "./components/StatsStreaks";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Toaster } from "./components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import {
  initializeSampleData,
  loadSampleData,
  skipSampleData,
} from "./utils/sampleData";

export default function App() {
  const [activeTab, setActiveTab] = useState("vocab");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSampleDataDialog, setShowSampleDataDialog] =
    useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem(
      "magicEnglishVisited",
    );
    if (!hasVisited) {
      setShowWelcome(true);
    } else {
      // Check if we should show sample data dialog
      const shouldShowSample = initializeSampleData();
      setShowSampleDataDialog(shouldShowSample);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("magicEnglishVisited", "true");
    setShowWelcome(false);

    // After welcome, check for sample data
    const shouldShowSample = initializeSampleData();
    setShowSampleDataDialog(shouldShowSample);
  };

  const handleLoadSampleData = () => {
    loadSampleData();
    setShowSampleDataDialog(false);
    // Refresh the page to show sample data
    window.location.reload();
  };

  const handleSkipSampleData = () => {
    skipSampleData();
    setShowSampleDataDialog(false);
  };

  if (showWelcome) {
    return (
      <>
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <WelcomeScreen onGetStarted={handleGetStarted} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "vocab" && <MagicVocab />}
      {activeTab === "grammar" && <GrammarChecker />}
      {activeTab === "stats" && <StatsStreaks />}

      <Toaster position="top-right" />

      {/* Sample Data Dialog */}
      <AlertDialog
        open={showSampleDataDialog}
        onOpenChange={setShowSampleDataDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có muốn tải dữ liệu mẫu không?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Để trải nghiệm ứng dụng tốt hơn, chúng tôi có thể
              tải sẵn 6 từ vựng mẫu và một chuỗi streak 5 ngày
              để bạn xem cách hoạt động của ứng dụng.
              <br />
              <br />
              Bạn có thể xóa dữ liệu này bất cứ lúc nào và thêm
              từ vựng của riêng mình.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSkipSampleData}>
              Không, cảm ơn
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLoadSampleData}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Có, tải dữ liệu mẫu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}