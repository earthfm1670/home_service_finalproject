export default function TestProfile() {
  return (
    <div className="content bg-gray-300 h-96 flex flex-col justify-start w-full lg:ml-72">
      <li>User ID : a8371d36-b1af-4582-a31d-4edf8fbacb38 </li>
      <li>User Name : User One </li>
      <li>User Email : user001@example.com </li>
      <li>User Phone : 0123456789</li>
      <li>User Role : customer </li>
    </div>
  );
}
/**
 *   {isLoading ? profileSkeleton() : TestProfile()}
 * <div className="content bg-gray-300 h-96 flex flex-col justify-start w-full lg:ml-72">
            <li>User ID : {userInfo.userId || ""} </li>
            <li>User Name : {userInfo.userName || ""} </li>
            <li>User Email : {email || ""} </li>
            <li>User Phone : {userInfo.userPhone || ""}</li>
            <li>User Role : {userRole || ""} </li>
          </div>
 */
