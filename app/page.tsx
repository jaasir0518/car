// app/page.js (or app/page.tsx if using TypeScript)
import HeroSection from '@/components/home/HeroSection';
import FeaturedCars from '@/components/home/FeaturedCars';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Header from '@/components/layout/Header';  // Corrected import

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      <Header />
      <HeroSection />
      <FeaturedCars />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}






// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
//   CardDescription,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import {
//   Trash2,
//   Clock,
//   DollarSign,
//   PlusCircle,
//   Calendar,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// // Define the Job interface
// interface Job {
//   id: number;
//   name: string;
//   start: number;
//   end: number;
//   profit: number;
//   color?: string;
// }

// // Different scheduling algorithms
// type SchedulingAlgorithm = "profit" | "duration" | "efficiency";

// // Color palette for job visualization
// const colorPalette = [
//   "#8B5CF6", // Purple
//   "#EC4899", // Pink
//   "#F59E0B", // Amber
//   "#10B981", // Emerald
//   "#3B82F6", // Blue
//   "#EF4444", // Red
//   "#14B8A6", // Teal
//   "#F97316", // Orange
//   "#6366F1", // Indigo
//   "#84CC16", // Lime
// ];

// export default function Home() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [newJob, setNewJob] = useState<Omit<Job, "id" | "color">>({
//     name: "",
//     start: 0,
//     end: 0,
//     profit: 0,
//   });
//   const [scheduledJobs, setScheduledJobs] = useState<Job[]>([]);
//   const [totalProfit, setTotalProfit] = useState<number>(0);
//   const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>("profit");
//   const [rejectedJobs, setRejectedJobs] = useState<Job[]>([]);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

//   // Toggle dark mode
//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [isDarkMode]);

//   // Handle input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "name") {
//       setNewJob({
//         ...newJob,
//         [name]: value,
//       });
//     } else {
//       setNewJob({
//         ...newJob,
//         [name]: parseInt(value, 10) || 0,
//       });
//     }
//   };

//   // Add a new job with random color
//   const addJob = () => {
//     if (newJob.start >= newJob.end) {
//       alert("End time must be greater than start time");
//       return;
//     }

//     if (!newJob.name.trim()) {
//       alert("Please enter a job name");
//       return;
//     }

//     const job: Job = {
//       id: Date.now(),
//       ...newJob,
//       color: colorPalette[jobs.length % colorPalette.length],
//     };

//     setJobs([...jobs, job]);
//     setNewJob({ name: "", start: 0, end: 0, profit: 0 });
//   };

//   // Remove a specific job
//   const removeJob = (id: number) => {
//     setJobs(jobs.filter((job) => job.id !== id));
//   };

//   // Clear all jobs
//   const clearJobs = () => {
//     setJobs([]);
//     setScheduledJobs([]);
//     setRejectedJobs([]);
//     setTotalProfit(0);
//   };

//   // Advanced greedy algorithm with multiple strategies
//   const scheduleJobs = () => {
//     if (jobs.length === 0) {
//       alert("Please add some jobs first!");
//       return;
//     }

//     // Sort jobs based on the selected algorithm
//     const sortedJobs = [...jobs];

//     switch (algorithm) {
//       case "profit":
//         // Sort by profit (descending)
//         sortedJobs.sort((a, b) => b.profit - a.profit);
//         break;
//       case "duration":
//         // Sort by duration (ascending)
//         sortedJobs.sort((a, b) => a.end - a.start - (b.end - b.start));
//         break;
//       case "efficiency":
//         // Sort by profit per hour (descending)
//         sortedJobs.sort(
//           (a, b) => b.profit / (b.end - b.start) - a.profit / (a.end - a.start)
//         );
//         break;
//     }

//     // Array to keep track of time slots
//     const timeSlots: boolean[] = Array(24).fill(false);
//     const selectedJobs: Job[] = [];
//     const notSelectedJobs: Job[] = [];
//     let profit = 0;

//     // Select jobs one by one
//     for (const job of sortedJobs) {
//       let canSchedule = true;

//       // Check if the job can be scheduled without conflicts
//       for (let i = job.start; i < job.end; i++) {
//         if (timeSlots[i]) {
//           canSchedule = false;
//           break;
//         }
//       }

//       // If we can schedule this job
//       if (canSchedule) {
//         // Mark the time slots as occupied
//         for (let i = job.start; i < job.end; i++) {
//           timeSlots[i] = true;
//         }

//         selectedJobs.push(job);
//         profit += job.profit;
//       } else {
//         notSelectedJobs.push(job);
//       }
//     }

//     setScheduledJobs(selectedJobs);
//     setRejectedJobs(notSelectedJobs);
//     setTotalProfit(profit);
//   };

//   // Format time for display
//   const formatTime = (hour: number) => {
//     return ${hour}:00;
//   };

//   // Calculate job efficiency (profit per hour)
//   const calculateEfficiency = (job: Job) => {
//     return (job.profit / (job.end - job.start)).toFixed(2);
//   };

//   return (
//     <main
//       className={`flex min-h-screen flex-col items-center p-4 transition-colors duration-300 ${
//         isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
//       }`}
//     >
//       <div className="w-full max-w-6xl space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Job Scheduling
//             </h1>
//             <p
//               className={`text-lg ${
//                 isDarkMode ? "text-gray-300" : "text-gray-600"
//               }`}
//             >
//               Maximize Profit using Greedy Algorithms
//             </p>
//           </div>
//           <Button
//             variant={isDarkMode ? "outline" : "default"}
//             onClick={() => setIsDarkMode(!isDarkMode)}
//             className="rounded-full"
//           >
//             {isDarkMode ? "☀ Light" : "🌙 Dark"}
//           </Button>
//         </div>

//         {/* Add new job form */}
//         <Card
//           className={`shadow-lg border-t-4 border-t-purple-500 ${
//             isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
//           }`}
//         >
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <PlusCircle className="h-5 w-5 text-purple-500" />
//               Add New Job
//             </CardTitle>
//             <CardDescription>
//               Enter job details to add to the schedule
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//               <div className="space-y-2 md:col-span-2">
//                 <Label htmlFor="name" className="flex items-center gap-1">
//                   <Calendar className="h-4 w-4" /> Job Name
//                 </Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   value={newJob.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter job name"
//                   className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="start" className="flex items-center gap-1">
//                   <Clock className="h-4 w-4" /> Start Time
//                 </Label>
//                 <Input
//                   id="start"
//                   name="start"
//                   type="number"
//                   min="0"
//                   max="23"
//                   value={newJob.start}
//                   onChange={handleInputChange}
//                   placeholder="0-23"
//                   className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="end" className="flex items-center gap-1">
//                   <Clock className="h-4 w-4" /> End Time
//                 </Label>
//                 <Input
//                   id="end"
//                   name="end"
//                   type="number"
//                   min="1"
//                   max="24"
//                   value={newJob.end}
//                   onChange={handleInputChange}
//                   placeholder="1-24"
//                   className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="profit" className="flex items-center gap-1">
//                   <DollarSign className="h-4 w-4" /> Profit
//                 </Label>
//                 <Input
//                   id="profit"
//                   name="profit"
//                   type="number"
//                   min="1"
//                   value={newJob.profit}
//                   onChange={handleInputChange}
//                   placeholder="Enter profit"
//                   className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-4">
//               <Button
//                 onClick={addJob}
//                 className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
//               >
//                 Add Job
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={clearJobs}
//                 className={
//                   isDarkMode
//                     ? "border-gray-600 text-gray-300 hover:bg-gray-700"
//                     : ""
//                 }
//               >
//                 Clear All
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Algorithm selection */}
//         <Card
//           className={`shadow-md ${
//             isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
//           }`}
//         >
//           <CardHeader>
//             <CardTitle className="text-base">Scheduling Algorithm</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant={algorithm === "profit" ? "default" : "outline"}
//                 onClick={() => setAlgorithm("profit")}
//                 className={
//                   algorithm === "profit"
//                     ? "bg-purple-600 hover:bg-purple-700"
//                     : isDarkMode
//                     ? "border-gray-600 text-gray-300"
//                     : ""
//                 }
//               >
//                 Sort by Profit
//               </Button>
//               <Button
//                 variant={algorithm === "duration" ? "default" : "outline"}
//                 onClick={() => setAlgorithm("duration")}
//                 className={
//                   algorithm === "duration"
//                     ? "bg-pink-600 hover:bg-pink-700"
//                     : isDarkMode
//                     ? "border-gray-600 text-gray-300"
//                     : ""
//                 }
//               >
//                 Sort by Duration
//               </Button>
//               <Button
//                 variant={algorithm === "efficiency" ? "default" : "outline"}
//                 onClick={() => setAlgorithm("efficiency")}
//                 className={
//                   algorithm === "efficiency"
//                     ? "bg-amber-600 hover:bg-amber-700"
//                     : isDarkMode
//                     ? "border-gray-600 text-gray-300"
//                     : ""
//                 }
//               >
//                 Sort by Efficiency (Profit/Hour)
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Jobs list */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card
//             className={`shadow-md ${
//               isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
//             }`}
//           >
//             <CardHeader className="pb-2">
//               <CardTitle>Available Jobs</CardTitle>
//               <CardDescription>
//                 {jobs.length} job{jobs.length !== 1 ? "s" : ""} available
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="max-h-72 overflow-auto">
//               {jobs.length === 0 ? (
//                 <p
//                   className={`text-center py-8 ${
//                     isDarkMode ? "text-gray-400" : "text-gray-500"
//                   }`}
//                 >
//                   No jobs added yet.
//                 </p>
//               ) : (
//                 <div className="grid grid-cols-1 gap-2">
//                   {jobs.map((job) => (
//                     <div
//                       key={job.id}
//                       className={`flex items-center justify-between p-3 rounded-md ${
//                         isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                       }`}
//                       style={{ borderLeft: 4px solid ${job.color} }}
//                     >
//                       <div className="flex flex-col">
//                         <span className="font-medium">{job.name}</span>
//                         <div className="flex items-center text-sm gap-4 mt-1">
//                           <span
//                             className={
//                               isDarkMode ? "text-gray-300" : "text-gray-600"
//                             }
//                           >
//                             ⏰ {formatTime(job.start)} - {formatTime(job.end)}
//                           </span>
//                           <span className="font-semibold text-green-600">
//                             ${job.profit}
//                           </span>
//                           <span
//                             className={`text-xs ${
//                               isDarkMode ? "text-gray-400" : "text-gray-500"
//                             }`}
//                           >
//                             (${calculateEfficiency(job)}/hr)
//                           </span>
//                         </div>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removeJob(job.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="pt-2 flex justify-center">
//               <Button
//                 onClick={scheduleJobs}
//                 disabled={jobs.length === 0}
//                 className={`w-full ${
//                   algorithm === "profit"
//                     ? "bg-purple-600 hover:bg-purple-700"
//                     : algorithm === "duration"
//                     ? "bg-pink-600 hover:bg-pink-700"
//                     : "bg-amber-600 hover:bg-amber-700"
//                 }`}
//               >
//                 Schedule Jobs
//               </Button>
//             </CardFooter>
//           </Card>

//           {/* Results */}
//           {scheduledJobs.length > 0 && (
//             <Card
//               className={`shadow-md ${
//                 isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
//               }`}
//             >
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center justify-between">
//                   <span>Optimal Schedule</span>
//                   <span className="text-lg bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
//                     Profit: ${totalProfit}
//                   </span>
//                 </CardTitle>
//                 <CardDescription>
//                   Using{" "}
//                   {algorithm === "profit"
//                     ? "profit-based"
//                     : algorithm === "duration"
//                     ? "duration-based"
//                     : "efficiency-based"}{" "}
//                   greedy algorithm
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="max-h-72 overflow-auto">
//                 <div className="space-y-2">
//                   {scheduledJobs.map((job) => (
//                     <div
//                       key={job.id}
//                       className={`flex items-center justify-between p-3 rounded-md ${
//                         isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                       }`}
//                       style={{ borderLeft: 4px solid ${job.color} }}
//                     >
//                       <div className="flex flex-col">
//                         <div className="flex items-center gap-2">
//                           <CheckCircle2 className="h-4 w-4 text-green-500" />
//                           <span className="font-medium">{job.name}</span>
//                         </div>
//                         <div className="flex items-center text-sm gap-4 mt-1">
//                           <span
//                             className={
//                               isDarkMode ? "text-gray-300" : "text-gray-600"
//                             }
//                           >
//                             ⏰ {formatTime(job.start)} - {formatTime(job.end)}
//                           </span>
//                           <span className="font-semibold text-green-600">
//                             ${job.profit}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                   {rejectedJobs.length > 0 && (
//                     <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                       <h4
//                         className={`font-medium mb-2 ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         }`}
//                       >
//                         Rejected Jobs
//                       </h4>
//                       {rejectedJobs.map((job) => (
//                         <div
//                           key={job.id}
//                           className={`flex items-center justify-between p-3 rounded-md ${
//                             isDarkMode
//                               ? "bg-gray-700 opacity-60"
//                               : "bg-gray-50 opacity-70"
//                           }`}
//                           style={{ borderLeft: 4px solid ${job.color} }}
//                         >
//                           <div className="flex flex-col">
//                             <div className="flex items-center gap-2">
//                               <XCircle className="h-4 w-4 text-red-500" />
//                               <span className="font-medium">{job.name}</span>
//                             </div>
//                             <div className="flex items-center text-sm gap-2 mt-1">
//                               <span
//                                 className={
//                                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                                 }
//                               >
//                                 {formatTime(job.start)} - {formatTime(job.end)}
//                               </span>
//                               <span
//                                 className={
//                                   isDarkMode ? "text-gray-400" : "text-gray-500"
//                                 }
//                               >
//                                 ${job.profit}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Timeline visualization */}
//         {scheduledJobs.length > 0 && (
//           <Card
//             className={`shadow-md ${
//               isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
//             }`}
//           >
//             <CardHeader>
//               <CardTitle>Schedule Timeline</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center mb-2">
//                 {Array.from({ length: 12 }, (_, i) => (
//                   <div
//                     key={i}
//                     className="flex-1 text-center text-xs font-medium"
//                   >
//                     {i * 2}
//                   </div>
//                 ))}
//               </div>
//               <div
//                 className={`h-16 flex relative ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-100"
//                 } border rounded-md`}
//               >
//                 {scheduledJobs.map((job) => (
//                   <div
//                     key={job.id}
//                     className="absolute h-full text-white text-xs flex items-center justify-center overflow-hidden rounded-sm transition-all hover:opacity-90 cursor-pointer"
//                     style={{
//                       left: ${(job.start / 24) * 100}%,
//                       width: ${((job.end - job.start) / 24) * 100}%,
//                       backgroundColor: job.color,
//                     }}
//                   >
//                     <div className="px-2 truncate">
//                       {job.name} (${job.profit})
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Hour markers */}
//               <div className="flex items-center mt-1">
//                 {Array.from({ length: 24 }, (_, i) => (
//                   <div
//                     key={i}
//                     className={`flex-1 text-center ${
//                       i % 2 === 0 ? "text-xs" : "text-xs opacity-0"
//                     }`}
//                   >
//                     |
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//             <CardFooter>
//               <div
//                 className={`text-sm ${
//                   isDarkMode ? "text-gray-300" : "text-gray-600"
//                 }`}
//               >
//                 <p>
//                   Using{" "}
//                   {algorithm === "profit"
//                     ? "profit-based"
//                     : algorithm === "duration"
//                     ? "duration-based"
//                     : "efficiency-based"}{" "}
//                   greedy algorithm for maximum profit.
//                 </p>
//                 <p className="mt-1">
//                   Total jobs: {jobs.length}, Scheduled: {scheduledJobs.length},
//                   Rejected: {rejectedJobs.length}
//                 </p>
//               </div>
//             </CardFooter>
//           </Card>
//         )}
//       </div>

//       {/* Stats dashboard */}
//       {jobs.length > 0 && (
//         <div className="w-full max-w-6xl mt-8">
//           <Card
//             className={`shadow-md overflow-hidden ${
//               isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
//             }`}
//           >
//             <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//               <CardTitle>Job Statistics</CardTitle>
//               <CardDescription className="text-white opacity-90">
//                 Analysis of your scheduling data
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
//               <div
//                 className={`rounded-lg p-4 ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                 }`}
//               >
//                 <h3 className="text-lg font-medium mb-3">Scheduling Rate</h3>
//                 <div className="flex items-end gap-2">
//                   <span className="text-3xl font-bold">
//                     {scheduledJobs.length > 0
//                       ? Math.round((scheduledJobs.length / jobs.length) * 100)
//                       : 0}
//                     %
//                   </span>
//                   <span
//                     className={`text-sm ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   >
//                     of jobs scheduled
//                   </span>
//                 </div>
//                 <div className="mt-4 w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
//                     style={{
//                       width: `${
//                         scheduledJobs.length > 0
//                           ? (scheduledJobs.length / jobs.length) * 100
//                           : 0
//                       }%`,
//                     }}
//                   ></div>
//                 </div>
//               </div>

//               <div
//                 className={`rounded-lg p-4 ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                 }`}
//               >
//                 <h3 className="text-lg font-medium mb-3">Time Utilization</h3>
//                 <div className="flex items-end gap-2">
//                   <span className="text-3xl font-bold">
//                     {scheduledJobs.length > 0
//                       ? Math.round(
//                           (scheduledJobs.reduce(
//                             (sum, job) => sum + (job.end - job.start),
//                             0
//                           ) /
//                             24) *
//                             100
//                         )
//                       : 0}
//                     %
//                   </span>
//                   <span
//                     className={`text-sm ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   >
//                     of 24 hours used
//                   </span>
//                 </div>
//                 <div className="mt-4 w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
//                     style={{
//                       width: `${
//                         scheduledJobs.length > 0
//                           ? (scheduledJobs.reduce(
//                               (sum, job) => sum + (job.end - job.start),
//                               0
//                             ) /
//                               24) *
//                             100
//                           : 0
//                       }%`,
//                     }}
//                   ></div>
//                 </div>
//               </div>

//               <div
//                 className={`rounded-lg p-4 ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-50"
//                 }`}
//               >
//                 <h3 className="text-lg font-medium mb-3">Profit Efficiency</h3>
//                 <div className="flex items-end gap-2">
//                   <span className="text-3xl font-bold">
//                     $
//                     {scheduledJobs.length > 0
//                       ? Math.round(
//                           totalProfit /
//                             scheduledJobs.reduce(
//                               (sum, job) => sum + (job.end - job.start),
//                               0
//                             )
//                         )
//                       : 0}
//                   </span>
//                   <span
//                     className={`text-sm ${
//                       isDarkMode ? "text-gray-400" : "text-gray-500"
//                     }`}
//                   >
//                     per hour
//                   </span>
//                 </div>
//                 <div className="mt-4 text-sm grid grid-cols-2 gap-2">
//                   <div>
//                     <span
//                       className={isDarkMode ? "text-gray-400" : "text-gray-500"}
//                     >
//                       Total Hours:
//                     </span>
//                     <span className="ml-1 font-medium">
//                       {scheduledJobs.reduce(
//                         (sum, job) => sum + (job.end - job.start),
//                         0
//                       )}
//                     </span>
//                   </div>
//                   <div>
//                     <span
//                       className={isDarkMode ? "text-gray-400" : "text-gray-500"}
//                     >
//                       Total Profit:
//                     </span>
//                     <span className="ml-1 font-medium">${totalProfit}</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Job comparison table */}
//           {scheduledJobs.length > 0 && (
//             <Card
//               className={`shadow-md mt-6 ${
//                 isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
//               }`}
//             >
//               <CardHeader>
//                 <CardTitle>Algorithm Performance</CardTitle>
//                 <CardDescription>
//                   Comparing different scheduling approaches
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div
//                   className={`overflow-x-auto ${
//                     isDarkMode ? "text-gray-300" : "text-gray-800"
//                   }`}
//                 >
//                   <table className="w-full">
//                     <thead>
//                       <tr
//                         className={`border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <th className="text-left py-3 px-4">Strategy</th>
//                         <th className="text-left py-3 px-4">Description</th>
//                         <th className="text-center py-3 px-4">Jobs Selected</th>
//                         <th className="text-right py-3 px-4">
//                           Estimated Profit
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr
//                         className={`border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <td className="py-3 px-4 font-medium text-purple-600">
//                           By Profit (Current)
//                         </td>
//                         <td
//                           className={`py-3 px-4 ${
//                             isDarkMode ? "text-gray-400" : "text-gray-600"
//                           }`}
//                         >
//                           Select most profitable jobs first
//                         </td>
//                         <td className="py-3 px-4 text-center">
//                           {algorithm === "profit" ? scheduledJobs.length : "?"}
//                         </td>
//                         <td className="py-3 px-4 text-right font-bold">
//                           ${algorithm === "profit" ? totalProfit : "?"}
//                         </td>
//                       </tr>
//                       <tr
//                         className={`border-b ${
//                           isDarkMode ? "border-gray-700" : "border-gray-200"
//                         }`}
//                       >
//                         <td className="py-3 px-4 font-medium text-pink-600">
//                           By Duration
//                         </td>
//                         <td
//                           className={`py-3 px-4 ${
//                             isDarkMode ? "text-gray-400" : "text-gray-600"
//                           }`}
//                         >
//                           Select shortest jobs first
//                         </td>
//                         <td className="py-3 px-4 text-center">
//                           {algorithm === "duration"
//                             ? scheduledJobs.length
//                             : "?"}
//                         </td>
//                         <td className="py-3 px-4 text-right font-bold">
//                           ${algorithm === "duration" ? totalProfit : "?"}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="py-3 px-4 font-medium text-amber-600">
//                           By Efficiency
//                         </td>
//                         <td
//                           className={`py-3 px-4 ${
//                             isDarkMode ? "text-gray-400" : "text-gray-600"
//                           }`}
//                         >
//                           Select jobs with highest profit/hour
//                         </td>
//                         <td className="py-3 px-4 text-center">
//                           {algorithm === "efficiency"
//                             ? scheduledJobs.length
//                             : "?"}
//                         </td>
//                         <td className="py-3 px-4 text-right font-bold">
//                           ${algorithm === "efficiency" ? totalProfit : "?"}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="mt-4 text-sm">
//                   <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
//                     Try different algorithms to compare their performance. The
//                     optimal strategy depends on your specific job set.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       )}

//       {/* Footer */}
//       <footer
//         className={`w-full mt-12 py-4 border-t ${
//           isDarkMode
//             ? "border-gray-800 text-gray-400"
//             : "border-gray-200 text-gray-600"
//         }`}
//       >
//         <div className="w-full max-w-6xl mx-auto px-4 text-center text-sm">
//           <p>Job Scheduling Algorithm - Greedy Approach</p>
//           <p className="mt-1">
//             A simple demonstration for educational purposes
//           </p>
//         </div>
//       </footer>
//     </main>
//   );
// }