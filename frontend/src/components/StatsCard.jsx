export default function StatsCard({title,value}){

return(

<div className="card text-center">

<h3 className="text-gray-500">{title}</h3>

<p className="text-3xl font-bold text-indigo-600">{value}</p>

</div>

)

}