import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PersonIcon from "@mui/icons-material/Person";
import { getAllUsersAndPostsAction } from "../../../redux/user_store";

Chart.register(...registerables);

const DashboardChart = () => {
  const postState = useSelector((state) => state.post);
  const userState = useSelector((state) => state.user);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstanceRef = useRef(null);
  const barChartInstanceRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsersAndPostsAction());
  }, [dispatch]);

  useEffect(() => {
    if (userState.usersAndPosts?.posts?.length > 0) {
      const posts = userState.usersAndPosts.posts;

      // Pie chart for mediaType
      const mediaTypeCounts = posts.reduce((acc, post) => {
        const type = post.mediaType || "text";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(mediaTypeCounts);
      const data = Object.values(mediaTypeCounts);

      if (pieChartInstanceRef.current) pieChartInstanceRef.current.destroy();

      const pieCtx = pieChartRef.current.getContext("2d");
      pieChartInstanceRef.current = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              label: "Media Type Distribution",
              data,
              backgroundColor: [
                "rgba(220, 20, 60, 0.7)",
                "rgba(0, 128, 128, 0.7)",
                "rgba(255, 165, 0, 0.7)",
              ],
              borderColor: [
                "rgba(220, 20, 60, 1)",
                "rgba(0, 128, 128, 1)",
                "rgba(255, 165, 0, 1)",
              ],
              borderWidth: 1,
              hoverOffset: 5,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const total = data.reduce((sum, value) => sum + value, 0);
                  const value = data[tooltipItem.dataIndex];
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${
                    labels[tooltipItem.dataIndex]
                  }: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });

      // Bar chart for monthly posts
      const today = new Date();
      const pastYear = new Date();
      pastYear.setFullYear(today.getFullYear() - 1);

      const months = [];
      const monthlyCounts = new Array(12).fill(0);

      for (let i = 0; i < 12; i++) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.unshift(
          month.toLocaleString("default", { month: "long", year: "numeric" })
        );
      }

      posts.forEach((post) => {
        const createdAt = new Date(post.createdAt);
        if (createdAt >= pastYear && createdAt <= today) {
          const monthDiff =
            today.getMonth() -
            createdAt.getMonth() +
            12 * (today.getFullYear() - createdAt.getFullYear());
          if (monthDiff >= 0 && monthDiff < 12) {
            monthlyCounts[11 - monthDiff]++;
          }
        }
      });

      if (barChartInstanceRef.current) barChartInstanceRef.current.destroy();

      const barCtx = barChartRef.current.getContext("2d");
      barChartInstanceRef.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: months,
          datasets: [
            {
              label: "Posts Created in the Last Year",
              data: monthlyCounts,
              backgroundColor: "rgba(0, 128, 128, 0.7)",
              borderColor: "rgba(0, 128, 128, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) =>
                  `${months[tooltipItem.dataIndex]}: ${
                    monthlyCounts[tooltipItem.dataIndex]
                  } posts`,
              },
            },
          },
        },
      });
    }
  }, [userState.usersAndPosts]);

  return (
    <div className="flex-[4]">
      <div className="flex items-center justify-ends gap-10 p-4">
        <div className="flex gap-4 items-center justify-between p-4 min-w-[12rem] bg-[#dc143c] text-white shadow-md rounded-md hover:scale-105">
          <div>
            <p className="text-md">Total Users</p>
            <p className="text-2xl">
              {userState.usersAndPosts?.users?.length || 0}
            </p>
          </div>
          <div>
            <PersonIcon />
          </div>
        </div>
        <div className="flex gap-4 items-center justify-between p-4 min-w-[12rem] bg-[#008080] text-white shadow-md rounded-md hover:scale-105">
          <div>
            <p className="text-md">Total Posts</p>
            <p className="text-2xl">
              {userState.usersAndPosts?.posts?.length || 0}
            </p>
          </div>
          <div>
            <PermMediaIcon />
          </div>
        </div>
      </div>
      <div className="flex gap-10 p-4">
        <div className="flex-1 border shadow-md p-5">
          <p>Posts Distribution with Media-Type</p>
          <div className="flex flex-col items-center">
            <canvas ref={pieChartRef} className="!h-[20rem]"></canvas>
          </div>
        </div>
        <div className="flex-1 border shadow-md p-5">
          <p>Posts created in past 1 year</p>
          <canvas ref={barChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
