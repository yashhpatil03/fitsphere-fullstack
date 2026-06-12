function StatCard({
title,
value,
icon,
color = "from-cyan-500 to-blue-500"
}) {


return (

    <div
        className={`
            bg-gradient-to-r
            ${color}
            text-white
            rounded-3xl
            shadow-xl
            p-6
            hover:scale-105
            transition
            duration-300
        `}    >

        <div className="flex justify-between items-center">

            <div>

                <p className="text-white/80">
                    {title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {value}
                </h2>

            </div>

            <div className="text-5xl">
                {icon}
            </div>

        </div>

    </div>

);


}

export default StatCard;
