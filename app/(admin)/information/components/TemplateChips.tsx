import { EMAIL_TEMPLATE, TemplateId } from "@/app/lib/TemplateEmailService";

interface Props  {
  selected: TemplateId | null
  onSelect: (id: TemplateId) => void
}

export function TemplateChips ({selected, onSelect}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {EMAIL_TEMPLATE.map((tpl) => (
        <button
          key={tpl.idTemplate}
          type="button"
          onClick={() => onSelect(tpl.idTemplate)}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors
            ${selected === tpl.idTemplate
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
        >
          {tpl.label}
        </button>
      ))}
    </div>
  );
}