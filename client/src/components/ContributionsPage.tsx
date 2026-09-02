import { useState } from "react";
import {
  GitCommit,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MOCK_CONTRIBUTION_LOGS = [
  {
    id: "log-1",
    date: "Sep 2, 2026",
    title: "restock: added 3.5 kg Whiskas Dry Kibble from Maria Santos",
    author: "Maria Santos",
    timeAgo: "15 minutes ago",
    kg: 3.5,
    status: "Verified",
    hash: "e7bc5ae",
  },
  {
    id: "log-2",
    date: "Sep 2, 2026",
    title: "restock: added 2 cans wet food and 1kg dry kibble (Anonymous donor)",
    author: "Anonymous",
    timeAgo: "2 hours ago",
    kg: 2.0,
    status: "Verified",
    hash: "53ec37d",
  },
  {
    id: "log-3",
    date: "Sep 1, 2026",
    title: "restock: bulk donation 7.0 kg Aozi Cat Food via Student Council",
    author: "CvSU Student Council",
    timeAgo: "1 day ago",
    kg: 7.0,
    status: "Verified",
    hash: "4a60cb6",
  },
  {
    id: "log-4",
    date: "Aug 30, 2026",
    title: "restock: added 4.0 kg Pedigree / generic mix by Juan Dela Cruz",
    author: "Juan Dela Cruz",
    timeAgo: "3 days ago",
    kg: 4.0,
    status: "Verified",
    hash: "9b12fe2",
  },
];

export function ContributionsPage({ isDarkMode }: { isDarkMode: boolean }) {
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("All Time");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dateOptions = ["All Time", "Sep 2, 2026", "Sep 1, 2026", "Aug 30, 2026"];

  const filteredLogs = selectedDateFilter === "All Time"
    ? MOCK_CONTRIBUTION_LOGS
    : MOCK_CONTRIBUTION_LOGS.filter((log) => log.date === selectedDateFilter);

  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = [];
    }
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, typeof MOCK_CONTRIBUTION_LOGS>);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-dashed">
        <div>
          <h2
            className={`text-base font-bold tracking-tight flex items-center gap-2 ${
              isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
            }`}
          >
            <GitCommit className="w-5 h-5 text-amber-600" /> Restock
            Contributions Timeline
          </h2>
          <p
            className={`text-xs text-muted-foreground font-normal ${
              isDarkMode ? "text-[#a38272]" : "text-[#785948]"
            }`}
          >
            History of verified food logs and station replenishment activities
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`rounded-xl px-3.5 h-9 text-xs font-medium border gap-2 shadow-sm ${
                isDarkMode
                  ? "border-[#382013] bg-[#261309] text-[#fff1e6] hover:bg-[#331c0e]"
                  : "border-[#ebdcd0] bg-white text-[#2e170a] hover:bg-[#fbf7f2]"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>{selectedDateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </Button>

            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-150 ${
                  isDarkMode
                    ? "bg-[#261309] border-[#382013] text-[#fff1e6]"
                    : "bg-white border-[#ebdcd0] text-[#2e170a]"
                }`}
              >
                <div
                  className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b ${
                    isDarkMode ? "border-[#382013] text-[#a38272]" : "border-[#f4e2d8] text-[#785948]"
                  }`}
                >
                  Filter by Date Window
                </div>
                {dateOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedDateFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedDateFilter === option
                        ? isDarkMode
                          ? "bg-[#382013] text-amber-300 font-semibold"
                          : "bg-[#f8efe6] text-amber-800 font-semibold"
                        : isDarkMode
                        ? "hover:bg-[#2e170e] text-[#d1b2a3]"
                        : "hover:bg-[#fbf7f2] text-[#5e4334]"
                    }`}
                  >
                    <span>{option}</span>
                    {selectedDateFilter === option && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedLogs).length === 0 ? (
          <div
            className={`p-8 text-center rounded-2xl border ${
              isDarkMode ? "border-[#382013] bg-[#261309]" : "border-[#ebdcd0] bg-white"
            }`}
          >
            <p className={`text-xs font-medium ${isDarkMode ? "text-[#a38272]" : "text-[#785948]"}`}>
              No contribution logs found for {selectedDateFilter}.
            </p>
          </div>
        ) : (
          Object.entries(groupedLogs).map(([dateGroup, logs]) => (
            <div key={dateGroup} className="space-y-3">
              <h3
                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 px-1 ${
                  isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Restocks on {dateGroup}
              </h3>

              <Card
                className={`rounded-2xl border overflow-hidden ${
                  isDarkMode
                    ? "border-[#382013] bg-[#261309]"
                    : "border-[#ebdcd0] bg-white"
                }`}
              >
                <CardContent className="p-0 divide-y divide-inherit">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors ${
                        isDarkMode ? "hover:bg-[#2e170e]" : "hover:bg-[#fbf7f2]"
                      }`}
                    >
                      <div className="space-y-1">
                        <p
                          className={`text-xs font-semibold hover:text-amber-600 cursor-pointer ${
                            isDarkMode ? "text-[#fff1e6]" : "text-[#2e170a]"
                          }`}
                        >
                          {log.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-normal">
                          <span
                            className={
                              isDarkMode ? "text-[#c2a293]" : "text-[#6e4e3d]"
                            }
                          >
                            {log.author}
                          </span>
                          <span>•</span>
                          <span
                            className={
                              isDarkMode ? "text-[#a38272]" : "text-[#785948]"
                            }
                          >
                            committed {log.timeAgo}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <Badge className="bg-emerald-600/20 text-emerald-500 border border-emerald-600/30 text-[10px] font-medium">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> {log.status}
                        </Badge>

                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                            isDarkMode
                              ? "bg-[#1c0f08] border-[#382013] text-amber-400"
                              : "bg-[#fdfbf7] border-[#ebdcd0] text-amber-700"
                          }`}
                        >
                          +{log.kg} kg
                        </span>

                        <code
                          className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                            isDarkMode
                              ? "bg-[#1c0f08] border-[#382013] text-[#a38272]"
                              : "bg-[#f5eeeb] border-[#e2d5ca] text-[#785948]"
                          }`}
                        >
                          {log.hash}
                        </code>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}