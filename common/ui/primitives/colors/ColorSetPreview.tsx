import { ColorClassMap } from "@/common/ui/colors";

interface ColorSetPreviewProps {
  label: string;
  text?: ColorClassMap;
  bg?: ColorClassMap;
}

export const ColorSetPreview = ({ label, text, bg }: ColorSetPreviewProps) => {
  const states = ["default", "hover", "active", "disabled"] as const;
  return (
    <div className="mb-6">
      <h4 className="text-sm font-bold mb-2">{label}</h4>
      <div className="grid grid-cols-4 gap-4">
        {states.map((state) => {
          console.log("text", text)
          const bgClass = bg?.[state];
       
          if(!bgClass) return
          const erasedHoverAndActiveBgClass = bgClass.replaceAll('hover:', '').replaceAll('active:', '')
          return (
            <div key={state} className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded ${erasedHoverAndActiveBgClass}`}
              >
    
              </div>
              <div className="text-xs mt-1">{state}</div>
              <div className="text-[10px] text-gray-400">{erasedHoverAndActiveBgClass}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
