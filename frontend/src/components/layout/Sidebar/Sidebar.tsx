import {
  LayoutDashboard,
  CreditCard,
  ChartBar,
  Bot,
  Settings,
  WalletCards
} from "lucide-react";


const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transações",
    icon: CreditCard,
  },
  {
    title: "Relatórios",
    icon: ChartBar,
  },
  {
    title: "Assistente IA",
    icon: Bot,
  },
  {
    title: "Configurações",
    icon: Settings,
  },
];


export function Sidebar() {

  return (

    <aside
      className="
      w-64
      min-h-screen
      bg-zinc-950
      border-r
      border-zinc-800
      px-5
      py-6
      "
    >


      {/* Logo */}

      <div className="flex items-center gap-3 mb-10">

        <div
          className="
          h-10
          w-10
          rounded-xl
          bg-purple-600
          flex
          items-center
          justify-center
          "
        >

          <WalletCards
            className="text-white"
            size={22}
          />

        </div>


        <div>

          <h1 className="text-white font-bold text-lg">
            Finance AI
          </h1>

          <p className="text-xs text-zinc-500">
            Smart Finance
          </p>

        </div>

      </div>



      {/* Menu */}

      <nav className="space-y-2">


        {
          menuItems.map((item)=>{

            const Icon = item.icon;


            return (

              <button
                key={item.title}
                className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-zinc-400
                hover:text-white
                hover:bg-zinc-900
                transition
                "
              >

                <Icon size={20}/>

                <span className="text-sm">
                  {item.title}
                </span>


              </button>

            )

          })
        }


      </nav>


    </aside>

  );

}