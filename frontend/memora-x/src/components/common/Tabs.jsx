import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="relative border-b border-neutral-800">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative pb-4 px-2 md:px-6 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.name
                  ? "text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>

              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}

              {activeTab === tab.name && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl -z-10" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="py-6 w-full overflow-visible">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={`w-full ${
              activeTab === tab.name
                ? "block animate-in fade-in duration-300"
                : "hidden"
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
