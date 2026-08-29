import { Link } from "react-router-dom";

export default function Navbar(){

return(

<div className="bg-indigo-600 text-white px-8 py-4 flex justify-between">

<h1 className="font-bold text-lg">Neural Decay Guard</h1>

<div className="flex gap-6">

<Link to="/dashboard">Dashboard</Link>
<Link to="/quiz">Quiz</Link>
<Link to="/history">History</Link>
<Link to="/leaderboard">Leaderboard</Link>
<Link to="/decay">Decay</Link>
<Link to="/recommend">Recommendations</Link>

</div>

</div>

)

}