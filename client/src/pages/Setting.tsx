import { useTheme } from "@/contexts/ThemeContext";
import { useFontSize } from "@/contexts/FontSizeContext";
import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { useSEO } from "@/hooks/useSEO"; // <- new

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  const SEO = useSEO({
    title: "Settings | ToolMemeX",
    description: "Manage your theme, font size, and other preferences on ToolMemeX.",
  });

  return (
    <>
      {SEO}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>

        {/* Theme Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
            <div className="flex flex-col">
              <span className="font-medium">Dark Mode</span>
              <span className="text-sm text-muted-foreground">
                Toggle between Light and Dark theme
              </span>
            </div>
            <Switch checked={theme === "dark"} onChange={toggleTheme} />
          </div>
        </div>

        {/* Font Size Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Text Size</h2>
          <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
            <div className="flex flex-col">
              <span className="font-medium">Font Size</span>
              <span className="text-sm text-muted-foreground">
                Choose the base font size
              </span>
            </div>
            <Select
              value={fontSize}
              onChange={(value) => setFontSize(value as any)}
              options={[
                { label: "Small", value: "small" },
                { label: "Medium", value: "medium" },
                { label: "Large", value: "large" },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;