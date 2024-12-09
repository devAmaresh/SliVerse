// utils/formatTimeAgo.ts
export const formatTimeAgo = (dateTime: string) => {
 const now = new Date();
 const updatedAt = new Date(dateTime);
 const diffInSeconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);
 const diffInMinutes = Math.floor(diffInSeconds / 60);
 const diffInHours = Math.floor(diffInMinutes / 60);
 const diffInDays = Math.floor(diffInHours / 24);

 if (diffInSeconds < 60) {
   return `${diffInSeconds} seconds ago`;
 } else if (diffInMinutes < 60) {
   return `${diffInMinutes} minutes ago`;
 } else if (diffInHours < 24) {
   return `${diffInHours} hours ago`;
 } else {
   return `${diffInDays} days ago`;
 }
};
