import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./language-provider";

interface LanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
];

export function LanguageModal({ open, onOpenChange }: LanguageModalProps) {
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as any);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Select Your Language
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-1 hover:bg-muted"
              onClick={() => handleLanguageSelect(lang.code)}
              data-testid={`button-language-${lang.code}`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.nativeName}</span>
              </div>
              <span className="text-sm text-muted-foreground">{lang.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
