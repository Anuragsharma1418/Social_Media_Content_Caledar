import * as XLSX from "xlsx";
import DateSummary from "./DateSummary";
import { useState, useEffect } from "react";
import { getPagesData } from "../API";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import ExportButton from "./ExportButton";
import Header from "./Header";
import DistributedPostsSummary from "./DistributedPostsSummary";

export default function CalendarGrid() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [category, setCategory] = useState("All");
  const [pagesData, setPagesData] = useState([]);
  const [distributedPosts, setDistributedPosts] = useState({});

  useEffect(() => {
    fetchDummyData();
  }, []);

  useEffect(() => {
    if (selectedDates.length > 0) {
      distributePosts();
    } else {
      setDistributedPosts({});
    }
  }, [selectedDates, category]);

  const fetchDummyData = () => {
    setPagesData(getPagesData);
  };

  const distributePosts = () => {
    const availableDates = [...selectedDates].sort((a, b) => a - b);
    const filteredPages =
      category === "All"
        ? pagesData
        : pagesData.filter((p) => p.category === category);
    const sortedPages = filteredPages.sort((a, b) => b.followers - a.followers);
    const posts = sortedPages.flatMap((page) =>
      page.posts.map((post) => ({ ...post, ...page }))
    );

    const distribution = {};
    let dateIndex = 0;
    posts.forEach((post) => {
      if (availableDates.length === 0) return;
      const assignedDate = availableDates[dateIndex % availableDates.length];
      const key = format(assignedDate, "yyyy-MM-dd");
      if (!distribution[key]) distribution[key] = [];
      distribution[key].push(post);
      dateIndex++;
    });
    setDistributedPosts(distribution);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const overview = Object.keys(distributedPosts).map((date) => {
      const posts = distributedPosts[date];
      const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
      const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
      const totalShares = posts.reduce((sum, p) => sum + p.shares, 0);
      return {
        Date: date,
        TotalPosts: posts.length,
        TotalLikes: totalLikes,
        TotalViews: totalViews,
        TotalShares: totalShares,
      };
    });
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(overview),
      "Overview"
    );

    Object.keys(distributedPosts).forEach((date) => {
      const posts = distributedPosts[date].map((p) => ({
        Date: date,
        PageName: p.pageName,
        ProfileLink: p.profileLink,
        Followers: p.followers,
        PostLink: p.postLink,
        Type: p.type,
        Likes: p.likes,
        Views: p.views,
        Shares: p.shares,
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(posts), date);
    });

    XLSX.writeFile(wb, "ContentCalendar.xlsx");
  };

  const handleDateClick = (day) => {
    const exists = selectedDates.some((d) => isSameDay(d, day));
    setSelectedDates(
      exists
        ? selectedDates.filter((d) => !isSameDay(d, day))
        : [...selectedDates, day]
    );
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const dummyCategories = ["All", "Meme", "Bollywood", "Edit"];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-100 to-blue-50 min-h-screen animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 text-center text-black animate-slide-in">
        Social Media Content Calendar
      </h1>

      <div className="mb-6 flex justify-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded shadow-md focus:outline-blue-500"
        >
          {dummyCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <Header currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />

      <div className="grid grid-cols-7 mb-2 animate-fade-in-delay">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="text-center font-semibold text-gray-700 uppercase text-sm tracking-wider"
          >
            {format(addDays(startOfWeek(new Date()), i), "EEE")}
          </div>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden shadow-md bg-white animate-fade-in-delay">
        {(() => {
          const rows = [];
          let day = startDate;
          while (day <= endDate) {
            const days = [];
            for (let i = 0; i < 7; i++) {
              const cloneDay = day;
              const isSelected = selectedDates.some((d) => isSameDay(d, day));
              const isToday = isSameDay(day, new Date());

              days.push(
                <div
                  key={day}
                  className={`p-3 text-center border cursor-pointer transition-all duration-300 rounded-md m-1 shadow-sm ${
                    !isSameMonth(day, currentMonth)
                      ? "text-gray-400"
                      : "text-gray-800"
                  } ${
                    isSelected
                      ? "bg-blue-500 text-white scale-105"
                      : "hover:bg-blue-100 hover:scale-105"
                  } ${isToday ? "border-2 border-blue-500" : ""}`}
                  onClick={() => handleDateClick(cloneDay)}
                >
                  {format(day, "d")}
                </div>
              );
              day = addDays(day, 1);
            }
            rows.push(
              <div key={day} className="grid grid-cols-7">
                {days}
              </div>
            );
          }
          return rows;
        })()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <DateSummary selectedDates={selectedDates} />
        <DistributedPostsSummary distributedPosts={distributedPosts} />
      </div>

      <ExportButton exportToExcel={exportToExcel} />
    </div>
  );
}
