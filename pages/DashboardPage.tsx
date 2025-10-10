import React, { useState, useEffect, useMemo } from "react";
import { PullRequestIcon, CommitsIcon, CommentsIcon, ChartIcon } from "../components/icons";
import Spinner from "../components/Spinner";
import StatCard from "../components/StatCard";
import Filters from "../components/Filters";
import PullRequestTable from "../components/PullRequestTable";

// Types
interface PullRequestSummary {
  id: number;
  user_id: number;
  name: string;
  url: string;
  url_pull_request: string;
  comments: number;
  review_comments: number;
  commits: number;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: PullRequestSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const DashboardPage: React.FC = () => {
  // Pagination + data
  const [summaries, setSummaries] = useState<PullRequestSummary[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // For stats
  const [allSummaries, setAllSummaries] = useState<PullRequestSummary[]>([]);

  // Loading & errors
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  // Fetch paginated data for table
  const fetchPaginatedData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
      }

      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());
      if (nameFilter) params.append("name", nameFilter);
      if (fromDate) params.append("from_date", (new Date(fromDate).getTime() / 1000).toString());
      if (toDate) params.append("to_date", (new Date(toDate).getTime() / 1000).toString());

      const response = await fetch(`http://localhost:3000/api/pr-summary?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Your session has expired. Please log in again.");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaginatedResponse = await response.json();
      setSummaries(data.data);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data for stats
  const fetchStatsData = async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem("jwt");
      if (!token) return;

      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "1000");
      if (nameFilter) params.append("name", nameFilter);
      if (fromDate) params.append("from_date", (new Date(fromDate).getTime() / 1000).toString());
      if (toDate) params.append("to_date", (new Date(toDate).getTime() / 1000).toString());

      const response = await fetch(`http://localhost:3000/api/pr-summary?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;
      const data: PaginatedResponse = await response.json();
      setAllSummaries(data.data);
    } catch (e) {
      console.error("Failed to fetch stats data:", e);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch when filters or pagination change
  useEffect(() => {
    fetchPaginatedData();
    fetchStatsData();
  }, [currentPage, pageSize, nameFilter, fromDate, toDate]);

  // Calculate stats
  const stats = useMemo(() => {
    if (allSummaries.length === 0) {
      return { totalPRs: 0, totalCommits: 0, totalComments: 0, avgCommits: 0 };
    }
    const totalPRs = allSummaries.length;
    const totalCommits = allSummaries.reduce((s, pr) => s + (pr.commits || 0), 0);
    const totalComments = allSummaries.reduce((s, pr) => s + (pr.comments || 0), 0);
    const avgCommits = totalPRs > 0 ? (totalCommits / totalPRs).toFixed(1) : 0;
    return { totalPRs, totalCommits, totalComments, avgCommits };
  }, [allSummaries]);

  // Filter handlers
  const handleApplyFilters = () => setCurrentPage(1);
  const handleClearFilters = () => {
    setNameFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white">Dashboard</h1>

       {/* Filters */}
      <Filters
        nameFilter={nameFilter}
        fromDate={fromDate}
        toDate={toDate}
        pageSize={pageSize}
        onNameChange={setNameFilter}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onPageSizeChange={(val) => {
          setPageSize(val);
          setCurrentPage(1);
        }}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pull Requests" value={statsLoading ? "..." : stats.totalPRs} icon={<PullRequestIcon />} />
        <StatCard title="Total Commits" value={statsLoading ? "..." : stats.totalCommits} icon={<CommitsIcon />} />
        <StatCard title="Total Comments" value={statsLoading ? "..." : stats.totalComments} icon={<CommentsIcon />} />
        <StatCard title="Avg. Commits / PR" value={statsLoading ? "..." : stats.avgCommits} icon={<ChartIcon />} />
      </div>

      {/* Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Pull Request Activity</h2>
        {loading ? (
          <Spinner />
        ) : (
          <PullRequestTable
            summaries={summaries}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
