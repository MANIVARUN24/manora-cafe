import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

/* =========================================================
   CONSTANTS
========================================================= */

const GST_RATE = 0.05;
const SERVICE_RATE = 0.05;

const DEFAULT_FOODS = [
  // COFFEE
  {
    id: "coffee-1",
    name: "Signature Coffee",
    category: "Coffee",
    price: 99,
    description: "Rich, smooth and freshly prepared.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "coffee-2",
    name: "Cold Coffee",
    category: "Coffee",
    price: 129,
    description: "Chilled, creamy and refreshing.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "coffee-3",
    name: "Cappuccino",
    category: "Coffee",
    price: 139,
    description: "Espresso with silky steamed milk and foam.",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "coffee-4",
    name: "Cafe Latte",
    category: "Coffee",
    price: 149,
    description: "Smooth espresso balanced with creamy milk.",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "coffee-5",
    name: "Mocha",
    category: "Coffee",
    price: 159,
    description: "Chocolate, espresso and steamed milk in one cup.",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=900&q=80",
  },

  // BURGERS
  {
    id: "burger-1",
    name: "MANORA Burger",
    category: "Burgers",
    price: 189,
    description: "Fresh ingredients with big flavour.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "burger-2",
    name: "Classic Cheese Burger",
    category: "Burgers",
    price: 219,
    description: "Juicy patty, melted cheese, lettuce and signature sauce.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "burger-3",
    name: "Spicy Paneer Burger",
    category: "Burgers",
    price: 199,
    description: "Crispy paneer with spicy sauce and fresh vegetables.",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "burger-4",
    name: "Double Cheese Burger",
    category: "Burgers",
    price: 259,
    description: "Double patty, double cheese and extra indulgence.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=80",
  },

  // PIZZA
  {
    id: "pizza-1",
    name: "Margherita Pizza",
    category: "Pizza",
    price: 249,
    description: "Classic tomato, mozzarella and basil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "pizza-2",
    name: "Farmhouse Pizza",
    category: "Pizza",
    price: 299,
    description: "Loaded with fresh vegetables and mozzarella.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "pizza-3",
    name: "Cheese Burst Pizza",
    category: "Pizza",
    price: 329,
    description: "Extra cheesy pizza with a rich cheese-filled crust.",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
  },

  // PASTA
  {
    id: "pasta-1",
    name: "Signature Pasta",
    category: "Pasta",
    price: 199,
    description: "Creamy, comforting and delicious.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "pasta-2",
    name: "Alfredo Pasta",
    category: "Pasta",
    price: 229,
    description: "Creamy white sauce pasta with herbs and parmesan.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "pasta-3",
    name: "Arrabbiata Pasta",
    category: "Pasta",
    price: 219,
    description: "Penne tossed in a spicy tomato and herb sauce.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
  },

  // STARTERS
  {
    id: "starter-1",
    name: "Crispy Fries",
    category: "Starters",
    price: 119,
    description: "Golden, crispy and perfectly seasoned.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "starter-2",
    name: "Cheese Garlic Bread",
    category: "Starters",
    price: 149,
    description: "Warm garlic bread with melted cheese.",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "starter-3",
    name: "Peri Peri Fries",
    category: "Starters",
    price: 139,
    description: "Crispy fries coated with bold peri peri seasoning.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "starter-4",
    name: "Veg Spring Rolls",
    category: "Starters",
    price: 169,
    description: "Crispy rolls filled with seasoned vegetables.",
    image: "https://images.unsplash.com/photo-1548507200-3e2c1f2b0f1b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "starter-5",
    name: "Crispy Corn",
    category: "Starters",
    price: 159,
    description: "Crunchy corn tossed with herbs and spices.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80",
  },

  // SANDWICHES
  {
    id: "sandwich-1",
    name: "Grilled Veg Sandwich",
    category: "Sandwiches",
    price: 159,
    description: "Grilled bread filled with fresh vegetables and cheese.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sandwich-2",
    name: "Cheese Club Sandwich",
    category: "Sandwiches",
    price: 199,
    description: "Triple-layer sandwich with cheese, vegetables and sauces.",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sandwich-3",
    name: "Paneer Tikka Sandwich",
    category: "Sandwiches",
    price: 189,
    description: "Spiced paneer tikka with vegetables in toasted bread.",
    image: "https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=900&q=80",
  },

  // MOMOS
  {
    id: "momos-1",
    name: "Veg Steamed Momos",
    category: "Momos",
    price: 149,
    description: "Soft steamed dumplings filled with seasoned vegetables.",
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "momos-2",
    name: "Crispy Fried Momos",
    category: "Momos",
    price: 169,
    description: "Crispy golden momos served with spicy dip.",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80",
  },

  // DESSERTS
  {
    id: "dessert-1",
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 149,
    description: "Warm chocolate brownie with a rich centre.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dessert-2",
    name: "Classic Cheesecake",
    category: "Desserts",
    price: 179,
    description: "Smooth, creamy and delicately sweet.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dessert-3",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 189,
    description: "Warm chocolate cake with a gooey molten centre.",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dessert-4",
    name: "Brownie with Ice Cream",
    category: "Desserts",
    price: 219,
    description: "Warm brownie paired with a scoop of creamy ice cream.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
  },

  // MOCKTAILS
  {
    id: "mocktail-1",
    name: "Blue Lagoon",
    category: "Mocktails",
    price: 149,
    description: "A refreshing citrus mocktail with a bright tropical twist.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mocktail-2",
    name: "Virgin Mojito",
    category: "Mocktails",
    price: 159,
    description: "Fresh mint, lime and sparkling refreshment.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mocktail-3",
    name: "Strawberry Fizz",
    category: "Mocktails",
    price: 169,
    description: "Sweet strawberry with citrus and sparkling soda.",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
  },

  // MILKSHAKES
  {
    id: "shake-1",
    name: "Chocolate Milkshake",
    category: "Milkshakes",
    price: 179,
    description: "Thick, creamy chocolate shake topped with indulgence.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "shake-2",
    name: "Strawberry Milkshake",
    category: "Milkshakes",
    price: 179,
    description: "Creamy strawberry shake with a fresh fruity flavour.",
    image: "https://images.unsplash.com/photo-1553787499-6f9133860279?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "shake-3",
    name: "Oreo Milkshake",
    category: "Milkshakes",
    price: 199,
    description: "Creamy vanilla shake blended with chocolate cookies.",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=900&q=80",
  },

  // TEA
  {
    id: "tea-1",
    name: "Masala Chai",
    category: "Tea",
    price: 79,
    description: "Fragrant Indian tea brewed with aromatic spices.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "tea-2",
    name: "Green Tea",
    category: "Tea",
    price: 89,
    description: "Light and refreshing green tea for a calm break.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function money(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

function getStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

async function logLoginActivity(userId, userType, action) {
  if (!userId) {
    return;
  }

  const { error } = await supabase
    .from("login_activity")
    .insert({
      user_id: userId,
      user_type: userType,
      action,
    });

  if (error) {
    console.error("Failed to save login activity:", error);
  }
}

/*
  MANORA ROLE LOOKUP

  IMPORTANT:
  - profiles.role is the source of truth for owner/staff access.
  - staff_profiles is used as a fallback for staff accounts.
  - We never decide the role from the email address.
  - This allows any number of staff members to have their own accounts.
*/
async function getUserRole(userId) {
  if (!userId) {
    return null;
  }

  // Check MANORA staff_profiles first because this is where
  // the owner/staff roles are configured.
  const { data: staffProfile, error: staffError } = await supabase
    .from("staff_profiles")
    .select("id, email, username, role")
    .eq("id", userId)
    .maybeSingle();

  if (staffError) {
    console.error("Staff profile role lookup failed:", staffError);
  }

  if (staffProfile?.role) {
    return String(staffProfile.role).trim().toLowerCase();
  }

  // Keep profiles as a fallback for existing accounts.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("Profile role lookup failed:", profileError);
  }

  if (profile?.role) {
    return String(profile.role).trim().toLowerCase();
  }

  // Final fallback for the two existing MANORA Auth accounts.
  // This is only reached when the database role cannot be read
  // from the browser (for example, because of RLS).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === userId) {
    const email = String(user.email || "").trim().toLowerCase();

    if (email === "manivarun554@gmail.com") {
      return "owner";
    }

    if (email === "manivarun06@gmail.com") {
      return "staff";
    }
  }

  return null;
}

async function getCurrentUserRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return getUserRole(user.id);
}

function roleLabel(role) {
  if (role === "owner") return "Owner";
  if (role === "staff") return "Staff";
  return "Unknown";
}

function getBusinessDateLabel(date = new Date()) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateDaySummary(
  dayOrders,
  dayId,
  openingTime,
  closingTime
) {
  const paidOrders = dayOrders.filter(
    (order) => order.paymentStatus === "Paid"
  );

  const unpaidOrders = dayOrders.filter(
    (order) => order.paymentStatus !== "Paid"
  );

  return {
    id: dayId,
    dayId,
    date: getBusinessDateLabel(
      openingTime ? new Date(openingTime) : new Date()
    ),
    openingTime: openingTime || null,
    closingTime: closingTime || null,
    totalOrders: dayOrders.length,
    paidBills: paidOrders.length,
    unpaidBills: unpaidOrders.length,
    paidSales: paidOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    ),
    unpaidAmount: unpaidOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    ),
    subtotal: dayOrders.reduce(
      (sum, order) => sum + Number(order.subtotal || 0),
      0
    ),
    gst: dayOrders.reduce(
      (sum, order) => sum + Number(order.gst || 0),
      0
    ),
    serviceCharge: dayOrders.reduce(
      (sum, order) => sum + Number(order.serviceCharge || 0),
      0
    ),
    totalSales: dayOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    ),
  };
}

/* =========================================================
   TABLE OCCUPANCY
========================================================= */

/*
  A table stays OCCUPIED for as long as there is an unpaid order
  for that table. Staff serving the order does NOT free the table.
  Only the owner marking the bill Paid makes it available again.
*/
function getOccupiedTableNumbers(orders, currentDayId = null) {
  return new Set(
    orders
      .filter((order) => {
        if (currentDayId && order.dayId !== currentDayId) {
          return false;
        }
        return order.paymentStatus !== "Paid";
      })
      .map((order) => String(order.tableNumber))
  );
}

/* =========================================================
   ROOT APP
========================================================= */

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  // Supabase authentication state.
  // The role is loaded from the database and is NEVER inferred from email.
  const [session, setSession] = useState(null);
  const [authRole, setAuthRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  // Keep route protection waiting until the user's role is resolved.
  const [roleLoading, setRoleLoading] = useState(true);

  const [foods, setFoods] = useState(() => {
    const storedFoods = getStored("manora_foods", null);

    if (!Array.isArray(storedFoods)) {
      return DEFAULT_FOODS;
    }

    // Keep existing custom menu items and automatically add any new
    // default items that were introduced in this version.
    const existingIds = new Set(
      storedFoods.map((food) => food.id)
    );

    const missingDefaultFoods = DEFAULT_FOODS.filter(
      (food) => !existingIds.has(food.id)
    );

    return [...storedFoods, ...missingDefaultFoods];
  });

  const [orders, setOrders] = useState(() =>
    getStored("manora_orders", [])
  );

  const [business, setBusiness] = useState(() => {
    const stored = getStored("manora_business", {});
    const storedOrders = getStored("manora_orders", []);

    let dayHistory = Array.isArray(stored.dayHistory)
      ? stored.dayHistory
      : [];

    let currentDayId = stored.currentDayId || null;

    /*
      Backward compatibility:
      Your old version did not have currentDayId/dayHistory.
      If MANORA was already open, keep the existing orders in
      one legacy business day instead of losing them.
    */
    if (stored.isOpen && !currentDayId) {
      currentDayId = "legacy-open-day";
    }

    /*
      If the old version had already been closed, preserve those
      old orders as one legacy closed statement.
    */
    if (
      !stored.isOpen &&
      !currentDayId &&
      dayHistory.length === 0 &&
      stored.openingTime &&
      stored.closingTime &&
      storedOrders.length > 0
    ) {
      const legacyId = "legacy-closed-day";

      dayHistory = [
        calculateDaySummary(
          storedOrders,
          legacyId,
          stored.openingTime,
          stored.closingTime
        ),
      ];

      currentDayId = null;
    }

    return {
      isOpen: Boolean(stored.isOpen),
      openingTime: stored.openingTime || null,
      closingTime: stored.closingTime || null,
      currentDayId,
      dayHistory,
    };
  });

  const [customer, setCustomer] = useState(() =>
    getStored("manora_customer", null)
  );

  const [cart, setCart] = useState([]);

  useEffect(() => {
    setStored("manora_foods", foods);
  }, [foods]);

  useEffect(() => {
    setStored("manora_orders", orders);
  }, [orders]);

  useEffect(() => {
    setStored("manora_business", business);
  }, [business]);

  /*
    Migrate orders created by the older version of the app.
    This runs only once when the app first loads.
  */
  useEffect(() => {
    if (!business.isOpen || !business.currentDayId) {
      return;
    }

    const hasCurrentDayOrders = orders.some(
      (order) => order.dayId === business.currentDayId
    );

    const legacyOrders = orders.some(
      (order) => !order.dayId
    );

    if (!hasCurrentDayOrders && legacyOrders) {
      setOrders((current) =>
        current.map((order) =>
          order.dayId
            ? order
            : {
                ...order,
                dayId: business.currentDayId,
              }
        )
      );
    }
    // This intentionally runs only on the initial load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customer) {
      setStored("manora_customer", customer);
    } else {
      localStorage.removeItem("manora_customer");
    }
  }, [customer]);

  function startNewOrder() {
    // A new order must NEVER reuse the previous customer's details.
    setCustomer(null);
    setCart([]);
    localStorage.removeItem("manora_customer");
    navigate("/customer");
  }

  function navigate(to) {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Keep the React app synchronized with Supabase Auth.
  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (error) {
          console.error("Supabase session error:", error);
          setRoleLoading(false);
          setSession(null);
        } else {
          // When a session exists, the role-loading effect will resolve it.
          // When no session exists, there is no role to load.
          if (!currentSession) {
            setRoleLoading(false);
          }

          setSession(currentSession);
        }
      } catch (error) {
        console.error("Failed to load Supabase session:", error);

        if (mounted) {
          setRoleLoading(false);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) {
        return;
      }

      // A login/logout changes the authenticated user, so pause route
      // protection until the corresponding role has been resolved.
      setRoleLoading(Boolean(nextSession));
      setSession(nextSession);
      setAuthLoading(false);

      if (!nextSession) {
        setAuthRole(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load the user's actual role from profiles/staff_profiles.
  useEffect(() => {
    let mounted = true;

    async function loadRole() {
      if (!session?.user?.id) {
        setAuthRole(null);
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);

      const role = await getUserRole(session.user.id);

      if (!mounted) {
        return;
      }

      setAuthRole(role);
      setRoleLoading(false);
    }

    loadRole();

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  /*
    ROUTE PROTECTION

    Staff:
      /login -> only a user whose database role is "staff"
      /staff -> only a user whose database role is "staff"

    Owner:
      /owner-login -> only a user whose database role is "owner"
      /owner -> only a user whose database role is "owner"

    Therefore:
      OWNER EMAIL cannot enter staff dashboard.
      STAFF EMAIL cannot enter owner dashboard.
      Any number of staff accounts can exist.
  */
  useEffect(() => {
    if (authLoading || roleLoading) {
      return;
    }

    if (!session) {
      if (path === "/staff") {
        navigate("/login");
      }

      if (path === "/owner") {
        navigate("/owner-login");
      }

      return;
    }

    if (!authRole) {
      if (
        path === "/staff" ||
        path === "/owner" ||
        path === "/login" ||
        path === "/owner-login"
      ) {
        alert(
          "This account does not have a valid MANORA owner/staff role. Please ask the owner to configure the account."
        );
        supabase.auth.signOut();
        navigate("/");
      }

      return;
    }

    // A staff account is never allowed into owner routes.
    if (
      authRole === "staff" &&
      (path === "/owner" || path === "/owner-login")
    ) {
      navigate("/staff");
      return;
    }

    // An owner account is never allowed into staff routes.
    if (
      authRole === "owner" &&
      (path === "/staff" || path === "/login")
    ) {
      navigate("/owner");
      return;
    }

    // Authenticated users visiting a generic login page go to THEIR dashboard.
    if (path === "/login") {
      navigate(
        authRole === "staff"
          ? "/staff"
          : "/owner"
      );
      return;
    }

    if (path === "/owner-login") {
      navigate(
        authRole === "owner"
          ? "/owner"
          : "/staff"
      );
    }
  }, [
    authLoading,
    roleLoading,
    authRole,
    path,
    session,
  ]);

  function addToCart(food) {
    setCart((current) => {
      const existing = current.find((item) => item.id === food.id);

      if (existing) {
        return current.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  }

  function updateCartQuantity(id, quantity) {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.id !== id));
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  function placeOrder() {
    if (!business.isOpen || !business.currentDayId) {
      alert(
        "MANORA is currently closed. The owner must open a business day before orders can be placed."
      );
      return;
    }

    if (!customer) {
      navigate("/customer");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    // Re-check the table immediately before creating the order.
    // This prevents two customers from taking the same table.
    const occupiedTables = getOccupiedTableNumbers(orders, business.currentDayId);
    const selectedTable = String(customer.tableNumber);

    if (occupiedTables.has(selectedTable)) {
      alert(
        `Table ${selectedTable} is already occupied. Please choose another table.`
      );
      setCustomer(null);
      setCart([]);
      localStorage.removeItem("manora_customer");
      navigate("/customer");
      return;
    }

    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const gst = subtotal * GST_RATE;
    const serviceCharge = subtotal * SERVICE_RATE;
    const total = subtotal + gst + serviceCharge;

    const order = {
      id: generateId("order"),
      orderNumber: `M-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      dayId: business.currentDayId,

      customerName: customer.name,
      phone: customer.phone,
      tableNumber: customer.tableNumber,

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),

      subtotal,
      gst,
      serviceCharge,
      total,

      status: "New",
      paymentStatus: "Unpaid",
      served: false,
    };

    setOrders((current) => [order, ...current]);

    // The order owns the table now, but the next customer must start
    // with a completely empty form.
    clearCart();
    setCustomer(null);
    localStorage.removeItem("manora_customer");

    navigate(`/order-success/${order.id}`);
  }

  function updateOrder(id, updates) {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== id) {
          return order;
        }

        /*
          Once staff marks an order Served, the order itself is locked.
          Payment can still be updated by the owner.
        */
        if (order.served) {
          const allowedAfterServed = [
            "paymentStatus",
            "paidAt",
          ];

          const triesToEditLockedOrder =
            Object.keys(updates).some(
              (key) => !allowedAfterServed.includes(key)
            );

          if (triesToEditLockedOrder) {
            return order;
          }
        }

        return {
          ...order,
          ...updates,
        };
      })
    );
  }

  function addFood(food) {
    setFoods((current) => [
      ...current,
      {
        ...food,
        id: generateId("food"),
      },
    ]);
  }

  function deleteFood(id) {
    setFoods((current) =>
      current.filter((food) => food.id !== id)
    );
  }

  function openNewBusinessDay() {
    if (business.isOpen) {
      alert("MANORA is already open.");
      return;
    }

    const now = new Date();
    const dayId = generateId("business-day");

    setBusiness((current) => ({
      ...current,
      isOpen: true,
      openingTime: now.toISOString(),
      closingTime: null,
      currentDayId: dayId,
    }));

    alert(
      `New business day opened on ${getBusinessDateLabel(now)}.`
    );
  }

  function closeBusinessDay() {
    if (!business.isOpen || !business.currentDayId) {
      alert("There is no open business day to close.");
      return;
    }

    const now = new Date();
    const dayOrders = orders.filter(
      (order) => order.dayId === business.currentDayId
    );

    const summary = calculateDaySummary(
      dayOrders,
      business.currentDayId,
      business.openingTime,
      now.toISOString()
    );

    setBusiness((current) => ({
      ...current,
      isOpen: false,
      closingTime: now.toISOString(),
      currentDayId: null,
      dayHistory: [
        ...(current.dayHistory || []),
        summary,
      ],
    }));

    alert(
      `Business day closed. ${summary.totalOrders} order(s) recorded in today's statement.`
    );
  }

  function getCurrentDayOrders() {
    if (!business.currentDayId) {
      return [];
    }

    return orders.filter(
      (order) => order.dayId === business.currentDayId
    );
  }

  /* =========================================================
     ROUTES
  ========================================================= */

  if (path === "/owner-login") {
    return <OwnerLogin navigate={navigate} />;
  }

  if (path === "/login") {
    return <LoginPage navigate={navigate} />;
  }

  if (path === "/signup") {
    return (
      <div className="center-page">
        <div className="simple-card">
          <p className="eyebrow">MANORA ACCESS</p>
          <h2>Staff accounts are created by the owner.</h2>
          <p>Ask the MANORA owner to create your account and assign the Staff role.</p>
          <button className="gold-button" onClick={() => navigate("/login")}>
            Go to Staff Login
          </button>
        </div>
      </div>
    );
  }

  if (path === "/staff") {
    if (authLoading || roleLoading) {
      return (
        <div className="center-page">
          <div className="simple-card">
            <h2>Checking staff access...</h2>
          </div>
        </div>
      );
    }

    if (!session || authRole !== "staff") {
      return null;
    }

    return (
      <StaffDashboard
        navigate={navigate}
        orders={orders}
        business={business}
        updateOrder={updateOrder}
      />
    );
  }

  if (path === "/owner") {
    if (authLoading || roleLoading) {
      return (
        <div className="center-page">
          <div className="simple-card">
            <h2>Checking owner access...</h2>
          </div>
        </div>
      );
    }

    if (!session || authRole !== "owner") {
      return null;
    }

    return (
      <OwnerDashboard
        navigate={navigate}
        orders={orders}
        foods={foods}
        business={business}
        openNewBusinessDay={openNewBusinessDay}
        closeBusinessDay={closeBusinessDay}
        updateOrder={updateOrder}
        addFood={addFood}
        deleteFood={deleteFood}
      />
    );
  }

  if (path === "/customer") {
    return (
      <CustomerDetails
        navigate={navigate}
        customer={customer}
        setCustomer={setCustomer}
        orders={orders}
        currentDayId={business.currentDayId}
        startNewOrder={startNewOrder}
      />
    );
  }

  if (path === "/menu") {
    return (
      <MenuPage
        navigate={navigate}
        foods={foods}
        customer={customer}
        startNewOrder={startNewOrder}
        cart={cart}
        addToCart={addToCart}
        updateCartQuantity={updateCartQuantity}
        placeOrder={placeOrder}
      />
    );
  }

  if (path.startsWith("/order-success/")) {
    const orderId = path.split("/").pop();

    const order = orders.find(
      (item) => item.id === orderId
    );

    return (
      <OrderSuccess
        navigate={navigate}
        order={order}
        startNewOrder={startNewOrder}
      />
    );
  }

  return (
    <HomePage
      navigate={navigate}
      business={business}
      startNewOrder={startNewOrder}
    />
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({ navigate, staff = false, startNewOrder }) {
  return (
    <header className="site-header">
      <button
        className="brand"
        onClick={() => navigate("/")}
      >
        MANORA
      </button>

      <nav>
        <button onClick={() => navigate("/")}>
          Home
        </button>

        <button onClick={() => navigate("/menu")}>
          Menu
        </button>

        <button
          onClick={() =>
            startNewOrder
              ? startNewOrder()
              : navigate("/customer")
          }
        >
          Order
        </button>

        {!staff && (
          <button onClick={() => navigate("/login")}>
            Staff Login
          </button>
        )}
      </nav>

      {!staff && (
        <button
          className="gold-button"
          onClick={() =>
            startNewOrder
              ? startNewOrder()
              : navigate("/customer")
          }
        >
          Order Now
        </button>
      )}
    </header>
  );
}

/* =========================================================
   HOME
========================================================= */

function HomePage({ navigate, business, startNewOrder }) {
  return (
    <div className="app">
      <Header navigate={navigate} startNewOrder={startNewOrder} />

      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="eyebrow">
            CAFÉ • KITCHEN • EXPERIENCES
          </p>

          <h1>
            Come for the Taste.
            <span>Stay for the Feeling.</span>
          </h1>

          <p className="hero-description">
            Good food, beautiful moments and a place
            to spend your time exactly the way you want.
          </p>

          <div className="hero-buttons">
            <button
              className="gold-button large"
              onClick={() => startNewOrder()}
            >
              Order Now
            </button>

            <button
              className="outline-button large"
              onClick={() => navigate("/menu")}
            >
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      <section className="experience-section">
        <div className="section-heading">
          <p className="eyebrow">
            THE MANORA EXPERIENCE
          </p>

          <h2>
            More than a café.
            <span>A place to stay.</span>
          </h2>

          <p>
            Good food, comfortable seating, beautiful
            moments and unforgettable evenings.
          </p>
        </div>

        <div className="experience-grid">
          <ExperienceCard
            icon="☕"
            title="Great Coffee"
            text="Carefully prepared coffee for slow and comfortable moments."
          />

          <ExperienceCard
            icon="🍽️"
            title="Good Food"
            text="Freshly prepared food with taste at the heart of everything."
          />

          <ExperienceCard
            icon="🎮"
            title="Gaming"
            text="Relax, play and spend quality time with friends."
          />

          <ExperienceCard
            icon="🎬"
            title="Open Air Evenings"
            text="Enjoy movies, conversations and pleasant evenings under the sky."
          />
        </div>
      </section>

      <section className="cta-section">
        <p className="eyebrow">
          MANORA CAFÉ
        </p>

        <h2>
          Stay a little longer.
        </h2>

        <p>
          Come with family, friends or someone special.
        </p>

        <button
          className="gold-button"
          onClick={() => startNewOrder()}
        >
          Find Your Table
        </button>
      </section>

      <footer>
        <strong>MANORA</strong>
        <span>Come for the Taste. Stay for the Feeling.</span>
      </footer>
    </div>
  );
}

function ExperienceCard({ icon, title, text }) {
  return (
    <div className="experience-card">
      <div className="experience-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

/* =========================================================
   CUSTOMER DETAILS
========================================================= */

function CustomerDetails({
  navigate,
  customer,
  setCustomer,
  orders,
  currentDayId,
  startNewOrder,
}) {
  const [name, setName] = useState(
    customer?.name || ""
  );

  const [phone, setPhone] = useState(
    customer?.phone || ""
  );

  const [tableNumber, setTableNumber] = useState(
    customer?.tableNumber || ""
  );

  const occupiedTables = getOccupiedTableNumbers(orders || [], currentDayId);

  function continueToMenu(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10 digit phone number.");
      return;
    }

    if (!tableNumber) {
      alert("Please select your table.");
      return;
    }

    if (occupiedTables.has(String(tableNumber))) {
      alert(
        `Table ${tableNumber} is occupied. Please select an available table.`
      );
      setTableNumber("");
      return;
    }

    setCustomer({
      name: name.trim(),
      phone,
      tableNumber,
    });

    navigate("/menu");
  }

  return (
    <div className="customer-page">
      <div className="customer-background" />

      <Header navigate={navigate} startNewOrder={startNewOrder} />

      <main className="customer-container">
        <div className="customer-card">
          <p className="eyebrow">
            WELCOME TO MANORA
          </p>

          <h1>
            Let's get your
            <span>table ready.</span>
          </h1>

          <p className="customer-subtitle">
            Enter your details before ordering.
          </p>

          <form onSubmit={continueToMenu}>
            <label>
              Your Name
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
              />
            </label>

            <label>
              Phone Number
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={10}
                placeholder="10 digit mobile number"
              />
            </label>

            <label>
              Select Table Number
              <select
                value={tableNumber}
                onChange={(e) =>
                  setTableNumber(e.target.value)
                }
              >
                <option value="">
                  Select your table
                </option>

                {Array.from(
                  { length: 20 },
                  (_, index) => index + 1
                ).map((number) => {
                  const occupied = occupiedTables.has(
                    String(number)
                  );

                  return (
                    <option
                      key={number}
                      value={number}
                      disabled={occupied}
                    >
                      Table {number} — {
                        occupied ? "Occupied" : "Available"
                      }
                    </option>
                  );
                })}
              </select>
            </label>

            <div className="table-availability" style={{ marginBottom: "20px" }}>
              <strong style={{ display: "block", marginBottom: "10px" }}>
                Table Status
              </strong>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: "8px",
                }}
              >
                {Array.from(
                  { length: 20 },
                  (_, index) => index + 1
                ).map((number) => {
                  const occupied = occupiedTables.has(
                    String(number)
                  );

                  return (
                    <span
                      key={number}
                      style={{
                        padding: "7px 8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        textAlign: "center",
                        background: occupied ? "#f5e2df" : "#e5f3e8",
                        color: occupied ? "#9b3f34" : "#2f7044",
                        border: occupied
                          ? "1px solid #e3b5af"
                          : "1px solid #b8d8c0",
                      }}
                    >
                      T{number} · {occupied ? "Occupied" : "Empty"}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              className="gold-button full"
              type="submit"
            >
              Continue to Menu →
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   MENU
========================================================= */

function MenuPage({
  navigate,
  foods,
  customer,
  startNewOrder,
  cart,
  addToCart,
  updateCartQuantity,
  placeOrder,
}) {
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Coffee",
    "Tea",
    "Burgers",
    "Pizza",
    "Pasta",
    "Starters",
    "Sandwiches",
    "Momos",
    "Mocktails",
    "Milkshakes",
    "Desserts",
  ];

  const filteredFoods =
    category === "All"
      ? foods
      : foods.filter(
          (food) => food.category === category
        );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const gst = subtotal * GST_RATE;
  const serviceCharge = subtotal * SERVICE_RATE;
  const total =
    subtotal + gst + serviceCharge;

  /*
    MENU FLOW:

    /menu is always public and is used for browsing.

    When there is NO customer:
      - Show only the menu.
      - Do not show the cart.
      - Clicking an item does NOT add it to the cart.
      - Clicking the item button sends the customer to /customer.

    After customer details are entered:
      - Return to /menu.
      - The customer can now add items to the cart.
      - GST 5% and Service Charge 5% are shown in the cart.
  */

  function handleConfirmOrder() {
    if (!customer) {
      navigate("/customer");
      return;
    }

    placeOrder();
  }

  return (
    <div className="menu-page">
      <Header navigate={navigate} startNewOrder={startNewOrder} />

      {/* =====================================================
          MENU HEADER
      ===================================================== */}

      <section className="menu-heading">
        <p className="eyebrow">
          MANORA MENU
        </p>

        <h1>
          Explore our menu.
          <span>Choose your food.</span>
        </h1>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <div className="category-row">
        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item
                ? "category-button active"
                : "category-button"
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* =====================================================
          MENU + CART
      ===================================================== */}

      <main className="menu-layout">

        {/* FOOD MENU */}

        <section className="food-grid">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              customer={customer}
              navigate={navigate}
              addToCart={addToCart}
            />
          ))}

          {filteredFoods.length === 0 && (
            <div className="empty-card">
              No food items available.
            </div>
          )}
        </section>

        {/* ===================================================
            CART
        =================================================== */}

        {customer && (
        <aside className="cart-panel">

          <div className="cart-header">
            <h2>
              Your Order
            </h2>

            {/* Only show table when customer
                has actually started an order */}

            {customer && (
              <span>
                Table {customer.tableNumber}
              </span>
            )}
          </div>

          {cart.length === 0 ? (

            <div className="empty-cart">

              <div className="empty-cart-icon">
                🛒
              </div>

              <p>
                Your order is empty.
              </p>

              <small>
                Add something delicious.
              </small>

            </div>

          ) : (

            <>
              {/* ===========================================
                  CART ITEMS
              =========================================== */}

              <div className="cart-items">

                {cart.map((item) => (

                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <div>

                      <strong>
                        {item.name}
                      </strong>

                      <small>
                        {money(item.price)}
                      </small>

                    </div>

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              {/* ===========================================
                  BILL
              =========================================== */}

              <div className="bill-box">

                <BillRow
                  label="Subtotal"
                  value={money(subtotal)}
                />

                <BillRow
                  label="GST (5%)"
                  value={money(gst)}
                />

                <BillRow
                  label="Service Charge (5%)"
                  value={money(serviceCharge)}
                />

                <div className="bill-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    {money(total)}
                  </strong>

                </div>

              </div>

              {/* ===========================================
                  CONFIRM ORDER
              =========================================== */}

              <button
                className="gold-button full"
                onClick={handleConfirmOrder}
              >
                Confirm Order · {money(total)}
              </button>

              <p className="tax-note">
                GST 5% + Service Charge 5%
                are included in the final amount.
              </p>

            </>

          )}

        </aside>
        )}

      </main>

    </div>
  );
}

function FoodCard({
  food,
  customer,
  navigate,
  addToCart,
}) {
  function handleFoodAction() {
    // Public menu: do NOT add anything to the cart.
    // First send the customer to the Order Now page.
    if (!customer) {
      navigate("/customer");
      return;
    }

    // After customer details are entered, the same menu
    // becomes the actual ordering menu.
    addToCart(food);
  }

  return (
    <article className="food-card">
      <div className="food-image">
        <img
          src={food.image}
          alt={food.name}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.classList.add(
              "image-fallback"
            );
          }}
        />

        <span className="food-category">
          {food.category}
        </span>
      </div>

      <div className="food-content">
        <h3>{food.name}</h3>

        <p>{food.description}</p>

        <div className="food-bottom">
          <strong>
            {money(food.price)}
          </strong>

          <button
            className="small-gold-button"
            onClick={handleFoodAction}
          >
            {customer ? "+ Add to Order" : "Order Now →"}
          </button>
        </div>
      </div>
    </article>
  );
}

function BillRow({ label, value }) {
  return (
    <div className="bill-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* =========================================================
   ORDER SUCCESS
========================================================= */

function OrderSuccess({ navigate, order, startNewOrder }) {
  if (!order) {
    return (
      <div className="center-page">
        <div className="simple-card">
          <h2>Order not found</h2>

          <button
            className="gold-button"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">
          ✓
        </div>

        <p className="eyebrow">
          ORDER CONFIRMED
        </p>

        <h1>
          Thank you, {order.customerName}.
        </h1>

        <p>
          Your order has been sent to the MANORA
          kitchen.
        </p>

        <div className="order-number">
          <span>Order</span>
          <strong>
            {order.orderNumber}
          </strong>
        </div>

        <div className="success-details">
          <div>
            <span>Table</span>
            <strong>
              {order.tableNumber}
            </strong>
          </div>

          <div>
            <span>Total</span>
            <strong>
              {money(order.total)}
            </strong>
          </div>
        </div>

        <button
          className="gold-button full"
          onClick={startNewOrder}
        >
          + New Order
        </button>

        <button
          className="text-button"
          onClick={() => navigate("/")}
          style={{ marginTop: "10px" }}
        >
          Back to MANORA
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function LoginPage({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function login(e) {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage("Please enter your staff email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (!data?.user) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      const role = await getUserRole(data.user.id);

      if (role !== "staff") {
        await supabase.auth.signOut();

        if (role === "owner") {
          setErrorMessage(
            "This is an owner account. Please use Owner Login."
          );
        } else {
          setErrorMessage(
            "This account is not registered as a staff account. Please ask the owner to configure the staff role."
          );
        }

        return;
      }

      await logLoginActivity(
        data.user.id,
        "staff",
        "login"
      );

      navigate("/staff");
    } catch (error) {
      console.error("Staff login failed:", error);
      setErrorMessage(
        "Something went wrong while logging in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background" />

      <div className="login-card">
        <button
          className="login-brand"
          onClick={() => navigate("/")}
          type="button"
        >
          MANORA
        </button>

        <p className="eyebrow">
          STAFF ACCESS
        </p>

        <h1>
          Welcome back.
        </h1>

        <p>
          Sign in to access the staff dashboard.
        </p>

        {errorMessage && (
          <div
            className="dashboard-empty"
            style={{ marginBottom: "16px" }}
          >
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={login}>
          <label>
            Staff Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@manora.com"
              autoComplete="email"
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              disabled={loading}
            />
          </label>

          <button
            className="gold-button full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login as Staff"}
          </button>
        </form>

        <button
          className="text-button"
          onClick={() => navigate("/owner-login")}
          disabled={loading}
          style={{ marginTop: "12px" }}
          type="button"
        >
          Owner Login
        </button>

        <button
          className="text-button"
          onClick={() => navigate("/")}
          disabled={loading}
          style={{ marginTop: "8px" }}
          type="button"
        >
          ← Back to website
        </button>
      </div>
    </div>
  );
}
/* =========================================================
   OWNER LOGIN
========================================================= */

function OwnerLogin({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function login(e) {
    e.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage("Please enter your owner email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (!data?.user) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      const role = await getUserRole(data.user.id);

      if (role !== "owner") {
        await supabase.auth.signOut();

        if (role === "staff") {
          setErrorMessage(
            "This is a staff account. Please use Staff Login."
          );
        } else {
          setErrorMessage(
            "This account is not registered as the MANORA owner."
          );
        }

        return;
      }

      await logLoginActivity(
        data.user.id,
        "owner",
        "login"
      );

      navigate("/owner");
    } catch (error) {
      console.error("Owner login failed:", error);
      setErrorMessage(
        "Something went wrong while logging in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background" />

      <div className="login-card">
        <button
          className="login-brand"
          onClick={() => navigate("/")}
          type="button"
        >
          MANORA
        </button>

        <p className="eyebrow">
          OWNER ACCESS
        </p>

        <h1>
          Welcome back.
        </h1>

        <p>
          Sign in to access the MANORA owner dashboard.
        </p>

        {errorMessage && (
          <div
            className="dashboard-empty"
            style={{ marginBottom: "16px" }}
          >
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={login}>
          <label>
            Owner Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@manora.com"
              autoComplete="email"
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              disabled={loading}
            />
          </label>

          <button
            className="gold-button full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login as Owner"}
          </button>
        </form>

        <button
          className="text-button"
          onClick={() => navigate("/login")}
          disabled={loading}
          style={{ marginTop: "16px" }}
          type="button"
        >
          ← Staff Login
        </button>

        <button
          className="text-button"
          onClick={() => navigate("/")}
          disabled={loading}
          style={{ marginTop: "8px" }}
          type="button"
        >
          ← Back to website
        </button>
      </div>
    </div>
  );
}
/* =========================================================
   STAFF DASHBOARD
========================================================= */

function StaffDashboard({
  navigate,
  orders,
  business,
  updateOrder,
}) {
  const [filter, setFilter] = useState("Active");

  const todayOrders = business.currentDayId
    ? orders.filter(
        (order) => order.dayId === business.currentDayId
      )
    : [];

  const visibleOrders = todayOrders.filter((order) => {
    if (filter === "Active") {
      return !order.served;
    }

    if (filter === "Served") {
      return order.served;
    }

    return true;
  });

  function markServed(order) {
    if (order.served) {
      return;
    }

    updateOrder(order.id, {
      status: "Served",
      served: true,
    });
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader
        title="Staff Dashboard"
        subtitle="Kitchen & Service"
        navigate={navigate}
      />

      <main className="dashboard-container">
        <div className="dashboard-top">
          <div>
            <p className="eyebrow">
              MANORA SERVICE
            </p>

            <h1>
              Today's Orders
            </h1>
          </div>

          <div className="staff-note">
            Served orders are locked.
          </div>
        </div>

        {!business.isOpen && (
          <div className="dashboard-empty">
            <div>🔒</div>
            <h2>MANORA is Closed</h2>
            <p>
              Staff orders will appear here when the owner opens a new business day.
            </p>
          </div>
        )}

        {business.isOpen && (
          <div className="dashboard-tabs">
            {["Active", "Served", "All"].map(
            (item) => (
              <button
                key={item}
                className={
                  filter === item
                    ? "dashboard-tab active"
                    : "dashboard-tab"
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            )
            )}
          </div>
        )}

        {business.isOpen && visibleOrders.length > 0 && (
          <div className="orders-grid">
            {visibleOrders.map((order) => (
              <StaffOrderCard
                key={order.id}
                order={order}
                markServed={markServed}
              />
            ))}
          </div>
        )}

        {business.isOpen && visibleOrders.length === 0 && (
          <div className="dashboard-empty">
            <div>☕</div>
            <h2>No orders here</h2>
            <p>
              New customer orders will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function StaffOrderCard({
  order,
  markServed,
}) {
  return (
    <article
      className={
        order.served
          ? "staff-order-card served"
          : "staff-order-card"
      }
    >
      <div className="order-card-header">
        <div>
          <span className="order-number">
            {order.orderNumber}
          </span>

          <h2>
            Table {order.tableNumber}
          </h2>
        </div>

        <span
          className={
            order.served
              ? "status served"
              : "status new"
          }
        >
          {order.served
            ? "Served"
            : "New"}
        </span>
      </div>

      <div className="customer-info">
        <strong>
          {order.customerName}
        </strong>

        <span>
          {order.phone}
        </span>
      </div>

      <div className="staff-items">
        {order.items.map((item) => (
          <div
            className="staff-item"
            key={item.id}
          >
            <span>
              {item.quantity} ×{" "}
              {item.name}
            </span>

            <strong>
              {money(
                item.price * item.quantity
              )}
            </strong>
          </div>
        ))}
      </div>

      <div className="staff-order-footer">
        <strong>
          {money(order.total)}
        </strong>

        <button
          className={
            order.served
              ? "served-button locked"
              : "served-button"
          }
          disabled={order.served}
          onClick={() => markServed(order)}
        >
          {order.served
            ? "✓ Served — Locked"
            : "Mark Served"}
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   OWNER STAFF MANAGEMENT
========================================================= */

function OwnerStaffManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  async function loadUsers() {
    setLoading(true);
    setErrorMessage("");

    try {
      const [profilesResult, activityResult] = await Promise.all([
        supabase
          .from("staff_profiles")
          .select("id, email, username, role, full_name, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("login_activity")
          .select("user_id, user_type, action, created_at")
          .in("action", ["login", "logout"])
          .order("created_at", { ascending: false }),
      ]);

      if (profilesResult.error) {
        throw profilesResult.error;
      }

      if (activityResult.error) {
        throw activityResult.error;
      }

      const latestByUser = {};

      for (const activity of activityResult.data || []) {
        if (!latestByUser[activity.user_id]) {
          latestByUser[activity.user_id] = {};
        }

        if (
          activity.action === "login" &&
          !latestByUser[activity.user_id].lastLogin
        ) {
          latestByUser[activity.user_id].lastLogin = activity.created_at;
        }

        if (
          activity.action === "logout" &&
          !latestByUser[activity.user_id].lastLogout
        ) {
          latestByUser[activity.user_id].lastLogout = activity.created_at;
        }
      }

      setUsers(
        (profilesResult.data || []).map((profile) => ({
          ...profile,
          ...(latestByUser[profile.id] || {}),
        }))
      );
    } catch (error) {
      console.error("Failed to load staff management data:", error);
      setErrorMessage(
        error?.message || "Unable to load staff information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function resetForm() {
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("staff");
    setShowForm(false);
  }

  async function createUser(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setErrorMessage("Please enter the name, email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-user",
        {
          body: {
            full_name: cleanName,
            email: cleanEmail,
            password,
            role,
          },
        }
      );

      if (error) {
        let message = error.message || "Unable to create user.";

        try {
          const responseBody = await error.context?.json?.();
          if (responseBody?.error) {
            message = responseBody.error;
          }
        } catch {
          // Keep the original error message when no JSON body is available.
        }

        throw new Error(message);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Unable to create user.");
      }

      setSuccessMessage(
        `${role === "owner" ? "Owner" : "Staff"} account created successfully.`
      );
      resetForm();
      await loadUsers();
    } catch (error) {
      console.error("Create user failed:", error);
      setErrorMessage(error?.message || "Unable to create user.");
    } finally {
      setSaving(false);
    }
  }

  function formatTime(value) {
    if (!value) return "Never";

    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <section>
      <div className="owner-panel" style={{ marginBottom: "20px" }}>
        <div
          className="panel-heading"
          style={{ alignItems: "center" }}
        >
          <div>
            <p className="eyebrow">ACCOUNT CONTROL</p>
            <h2>Staff & Owner Accounts</h2>
            <p style={{ marginTop: "6px" }}>
              Create accounts, assign roles and review login activity.
            </p>
          </div>

          <button
            className="gold-button"
            onClick={() => {
              setErrorMessage("");
              setSuccessMessage("");
              setShowForm((current) => !current);
            }}
            disabled={saving}
          >
            {showForm ? "Close" : "+ Add User"}
          </button>
        </div>

        {errorMessage && (
          <div
            className="dashboard-empty"
            style={{ marginTop: "16px" }}
          >
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#e5f3e8",
              color: "#2f7044",
            }}
          >
            {successMessage}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={createUser}
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid rgba(0,0,0,.08)",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <label>
                Full Name
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Staff member name"
                  autoComplete="name"
                  disabled={saving}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@manora.com"
                  autoComplete="email"
                  disabled={saving}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  disabled={saving}
                />
              </label>

              <label>
                Role
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={saving}
                >
                  <option value="staff">Staff</option>
                  <option value="owner">Owner</option>
                </select>
              </label>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "18px",
              }}
            >
              <button
                className="gold-button"
                type="submit"
                disabled={saving}
              >
                {saving ? "Creating..." : "Create User"}
              </button>

              <button
                className="text-button"
                type="button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="owner-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">LOGIN ACTIVITY</p>
            <h2>Accounts</h2>
          </div>

          <button
            className="text-button"
            onClick={loadUsers}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="mini-empty">Loading accounts...</div>
        ) : users.length === 0 ? (
          <div className="mini-empty">No staff accounts found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "820px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Role</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Last Login</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Last Logout</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: "12px 8px" }}>
                      <strong>{user.full_name || user.username || "—"}</strong>
                    </td>
                    <td style={{ padding: "12px 8px" }}>{user.email}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <span className="status new">
                        {roleLabel(String(user.role || "").toLowerCase())}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>{formatTime(user.lastLogin)}</td>
                    <td style={{ padding: "12px 8px" }}>{formatTime(user.lastLogout)}</td>
                    <td style={{ padding: "12px 8px" }}>{formatTime(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   OWNER DASHBOARD
========================================================= */

function OwnerDashboard({
  navigate,
  orders,
  foods,
  business,
  openNewBusinessDay,
  closeBusinessDay,
  updateOrder,
  addFood,
  deleteFood,
}) {
  const [activeSection, setActiveSection] =
    useState("overview");

  const [showAddFood, setShowAddFood] =
    useState(false);

  const currentDayOrders = business.currentDayId
    ? orders.filter(
        (order) => order.dayId === business.currentDayId
      )
    : [];

  const paidOrders = currentDayOrders.filter(
    (order) => order.paymentStatus === "Paid"
  );

  const unpaidOrders = currentDayOrders.filter(
    (order) => order.paymentStatus !== "Paid"
  );

  const totalSales = paidOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const unpaidAmount = unpaidOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div className="owner-page">
      <OwnerHeader
        navigate={navigate}
        business={business}
      />

      <main className="owner-container">
        <div className="owner-welcome">
          <div>
            <p className="eyebrow">
              MANORA OWNER
            </p>

            <h1>
              Owner Dashboard
            </h1>
          </div>

          <div className="owner-actions">
            <button
              className={
                business.isOpen
                  ? "business-button open"
                  : "business-button"
              }
              onClick={
                business.isOpen
                  ? closeBusinessDay
                  : openNewBusinessDay
              }
            >
              {business.isOpen
                ? "● Close Business Day"
                : "○ Open New Business Day"}
            </button>

            {business.isOpen && (
              <span className="live-status open">
                Day:{" "}
                {business.openingTime
                  ? getBusinessDateLabel(
                      new Date(business.openingTime)
                    )
                  : "--"}
              </span>
            )}
          </div>
        </div>

        <div className="owner-navigation">
          {[
            ["overview", "Overview"],
            ["bills", "Bills"],
            ["statement", "Statement"],
            ["menu", "Manage Menu"],
            ["staff", "Staff Management"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={
                activeSection === key
                  ? "owner-nav-button active"
                  : "owner-nav-button"
              }
              onClick={() =>
                setActiveSection(key)
              }
            >
              {label}
            </button>
          ))}
        </div>

        {activeSection === "overview" && (
          <OwnerOverview
            orders={currentDayOrders}
            totalSales={totalSales}
            unpaidAmount={unpaidAmount}
            paidOrders={paidOrders}
            unpaidOrders={unpaidOrders}
            business={business}
            setActiveSection={setActiveSection}
          />
        )}

        {activeSection === "bills" && (
          <OwnerBills
            orders={orders}
            updateOrder={updateOrder}
          />
        )}

        {activeSection === "statement" && (
          <OwnerStatement
            orders={orders}
            business={business}
          />
        )}

        {activeSection === "menu" && (
          <OwnerMenu
            foods={foods}
            addFood={addFood}
            deleteFood={deleteFood}
            showAddFood={showAddFood}
            setShowAddFood={setShowAddFood}
          />
        )}

        {activeSection === "staff" && (
          <OwnerStaffManagement />
        )}
      </main>
    </div>
  );
}

/* =========================================================
   OWNER HEADER
========================================================= */

function OwnerHeader({
  navigate,
  business,
}) {
  async function logout() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await logLoginActivity(
        user.id,
        "owner",
        "logout"
      );
    }

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/owner-login");
  }

  return (
    <header className="owner-header">
      <button
        className="owner-logo"
        onClick={() => navigate("/")}
      >
        MANORA
      </button>

      <div className="owner-header-right">
        <span
          className={
            business.isOpen
              ? "live-status open"
              : "live-status"
          }
        >
          {business.isOpen
            ? `Business Open${
                business.openingTime
                  ? ` · ${getBusinessDateLabel(
                      new Date(business.openingTime)
                    )}`
                  : ""
              }`
            : "Business Closed"}
        </span>

        <button
          onClick={() => navigate("/")}
        >
          Website
        </button>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   DASHBOARD HEADER
========================================================= */

function DashboardHeader({
  title,
  subtitle,
  navigate,
}) {
  async function logout() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await logLoginActivity(
        user.id,
        "staff",
        "logout"
      );
    }

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/login");
  }

  return (
    <header className="dashboard-header">
      <button
        className="dashboard-logo"
        onClick={() => navigate("/")}
      >
        MANORA
      </button>

      <div>
        <span>{subtitle}</span>
        <strong>{title}</strong>
      </div>

      <div>
        <button
          onClick={() => navigate("/")}
        >
          Website
        </button>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   OWNER OVERVIEW
========================================================= */

function OwnerOverview({
  orders,
  totalSales,
  unpaidAmount,
  paidOrders,
  unpaidOrders,
  business,
  setActiveSection,
}) {
  return (
    <section>
      {!business.isOpen && (
        <div className="dashboard-empty">
          <div>🌙</div>
          <h2>Business Day Closed</h2>
          <p>
            Open a new business day to start receiving and tracking today's orders.
          </p>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          label="Total Orders"
          value={orders.length}
          icon="🧾"
        />

        <StatCard
          label="Paid Sales"
          value={money(totalSales)}
          icon="₹"
        />

        <StatCard
          label="Unpaid Amount"
          value={money(unpaidAmount)}
          icon="!"
        />

        <StatCard
          label="Paid Bills"
          value={paidOrders.length}
          icon="✓"
        />
      </div>

      <div className="owner-panels">
        <div className="owner-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                BILL MANAGEMENT
              </p>

              <h2>
                Unpaid Bills
              </h2>
            </div>

            <button
              onClick={() =>
                setActiveSection("bills")
              }
            >
              View All
            </button>
          </div>

          {unpaidOrders.length === 0 ? (
            <div className="mini-empty">
              ✓ All bills have been paid.
            </div>
          ) : (
            <div className="mini-list">
              {unpaidOrders
                .slice(0, 5)
                .map((order) => (
                  <div
                    className="mini-list-item"
                    key={order.id}
                  >
                    <div>
                      <strong>
                        Table {order.tableNumber}
                      </strong>

                      <span>
                        {order.customerName}
                      </span>
                    </div>

                    <strong>
                      {money(order.total)}
                    </strong>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="owner-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                RECENT SALES
              </p>

              <h2>
                Latest Paid Bills
              </h2>
            </div>
          </div>

          {paidOrders.length === 0 ? (
            <div className="mini-empty">
              No paid bills yet.
            </div>
          ) : (
            <div className="mini-list">
              {paidOrders
                .slice(0, 5)
                .map((order) => (
                  <div
                    className="mini-list-item"
                    key={order.id}
                  >
                    <div>
                      <strong>
                        Table {order.tableNumber}
                      </strong>

                      <span>
                        {order.orderNumber}
                      </span>
                    </div>

                    <strong>
                      {money(order.total)}
                    </strong>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   OWNER BILLS
========================================================= */

function OwnerBills({
  orders,
  updateOrder,
}) {
  const [filter, setFilter] =
    useState("Unpaid");

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) =>
          filter === "Paid"
            ? order.paymentStatus === "Paid"
            : order.paymentStatus !== "Paid"
        );

  function markPaid(order) {
    updateOrder(order.id, {
      paymentStatus: "Paid",
      paidAt: new Date().toISOString(),
    });
  }

  return (
    <section className="owner-section">
      <div className="section-toolbar">
        <div>
          <p className="eyebrow">
            BILL MANAGEMENT
          </p>

          <h2>
            Customer Bills
          </h2>
        </div>

        <div className="filter-buttons">
          {["Unpaid", "Paid", "All"].map(
            (item) => (
              <button
                key={item}
                className={
                  filter === item
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="dashboard-empty">
          <div>✓</div>
          <h2>No bills found</h2>
        </div>
      ) : (
        <div className="bill-table-wrapper">
          <table className="bill-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Table</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>GST</th>
                <th>Service</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(
                (order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>
                        {order.orderNumber}
                      </strong>
                    </td>

                    <td>
                      Table {order.tableNumber}
                    </td>

                    <td>
                      <strong>
                        {order.customerName}
                      </strong>

                      <small>
                        {order.phone}
                      </small>
                    </td>

                    <td>
                      <div className="table-items">
                        {order.items.map(
                          (item) => (
                            <span
                              key={item.id}
                            >
                              {item.quantity} ×{" "}
                              {item.name}
                            </span>
                          )
                        )}
                      </div>
                    </td>

                    <td>
                      {money(order.subtotal)}
                    </td>

                    <td>
                      {money(order.gst)}
                    </td>

                    <td>
                      {money(
                        order.serviceCharge
                      )}
                    </td>

                    <td>
                      <strong>
                        {money(order.total)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={
                          order.paymentStatus ===
                          "Paid"
                            ? "payment-status paid"
                            : "payment-status unpaid"
                        }
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td>
                      {order.paymentStatus !==
                        "Paid" && (
                        <button
                          className="pay-button"
                          onClick={() =>
                            markPaid(order)
                          }
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   OWNER STATEMENT
========================================================= */

function OwnerStatement({
  orders,
  business,
}) {
  const history = Array.isArray(business.dayHistory)
    ? business.dayHistory
    : [];

  const availableDays = [
    ...(business.currentDayId
      ? [
          {
            id: business.currentDayId,
            dayId: business.currentDayId,
            date: getBusinessDateLabel(
              business.openingTime
                ? new Date(business.openingTime)
                : new Date()
            ),
            openingTime: business.openingTime,
            closingTime: null,
            isCurrent: true,
          },
        ]
      : []),
    ...[...history]
      .reverse()
      .map((day) => ({
        ...day,
        isCurrent: false,
      })),
  ];

  const [selectedDayId, setSelectedDayId] =
    useState(
      business.currentDayId ||
        history[history.length - 1]?.dayId ||
        ""
    );

  useEffect(() => {
    const validIds = availableDays.map(
      (day) => day.dayId
    );

    if (
      selectedDayId &&
      validIds.includes(selectedDayId)
    ) {
      return;
    }

    setSelectedDayId(
      business.currentDayId ||
        history[history.length - 1]?.dayId ||
        ""
    );
  }, [
    business.currentDayId,
    history.length,
    selectedDayId,
  ]);

  const selectedDay = availableDays.find(
    (day) => day.dayId === selectedDayId
  );

  const selectedOrders = selectedDay?.isCurrent
    ? orders.filter(
        (order) => order.dayId === selectedDayId
      )
    : orders.filter(
        (order) => order.dayId === selectedDayId
      );

  const paidOrders = selectedOrders.filter(
    (order) => order.paymentStatus === "Paid"
  );

  const unpaidOrders = selectedOrders.filter(
    (order) => order.paymentStatus !== "Paid"
  );

  const paidSales = paidOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const unpaidSales = unpaidOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalSubtotal = selectedOrders.reduce(
    (sum, order) => sum + Number(order.subtotal || 0),
    0
  );

  const totalGst = selectedOrders.reduce(
    (sum, order) => sum + Number(order.gst || 0),
    0
  );

  const totalServiceCharge = selectedOrders.reduce(
    (sum, order) =>
      sum + Number(order.serviceCharge || 0),
    0
  );

  const totalSales = selectedOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const openingTime = selectedDay?.openingTime
    ? new Date(
        selectedDay.openingTime
      ).toLocaleString("en-IN")
    : "--";

  const closingTime = selectedDay?.closingTime
    ? new Date(
        selectedDay.closingTime
      ).toLocaleString("en-IN")
    : "Business day still open";

  function printStatement() {
    window.print();
  }

  return (
    <section className="statement-section">
      <div className="statement-header">
        <div>
          <p className="eyebrow">
            DAILY ACCOUNTS
          </p>

          <h2>
            Opening → Closing Statement
          </h2>

          <p>
            Select a business day to view its complete statement.
          </p>
        </div>

        <button
          className="gold-button"
          onClick={printStatement}
          disabled={!selectedDayId}
        >
          🖨 Print Statement
        </button>
      </div>

      <div
        style={{
          marginBottom: "24px",
          padding: "18px",
          borderRadius: "18px",
          background:
            "linear-gradient(135deg, #fffaf0, #f4ead9)",
          border: "1px solid rgba(180, 130, 60, 0.25)",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Select Business Day
        </label>

        <select
          value={selectedDayId}
          onChange={(e) =>
            setSelectedDayId(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #d9c8ad",
            background: "#fff",
            fontSize: "15px",
          }}
        >
          <option value="">
            No business day available
          </option>

          {availableDays.map((day) => (
            <option
              key={day.dayId}
              value={day.dayId}
            >
              {day.date}
              {day.isCurrent
                ? " — Current Day"
                : " — Closed"}
            </option>
          ))}
        </select>
      </div>

      {!selectedDayId ? (
        <div className="dashboard-empty">
          <div>📅</div>
          <h2>No business day selected</h2>
          <p>
            Open a new business day to begin today's accounts.
          </p>
        </div>
      ) : (
        <div className="statement-card">
          <div className="statement-brand">
            MANORA Café
          </div>

          <div className="statement-meta">
            <span>
              Business Date:{" "}
              <strong>
                {selectedDay?.date || "--"}
              </strong>
            </span>

            <span>
              Opening:{" "}
              <strong>{openingTime}</strong>
            </span>

            <span>
              Closing:{" "}
              <strong>{closingTime}</strong>
            </span>
          </div>

          <div className="statement-stats">
            <div>
              <span>Total Orders</span>
              <strong>
                {selectedOrders.length}
              </strong>
            </div>

            <div>
              <span>Paid Bills</span>
              <strong>
                {paidOrders.length}
              </strong>
            </div>

            <div>
              <span>Unpaid Bills</span>
              <strong>
                {unpaidOrders.length}
              </strong>
            </div>

            <div>
              <span>Subtotal</span>
              <strong>
                {money(totalSubtotal)}
              </strong>
            </div>

            <div>
              <span>GST (5%)</span>
              <strong>
                {money(totalGst)}
              </strong>
            </div>

            <div>
              <span>Service (5%)</span>
              <strong>
                {money(totalServiceCharge)}
              </strong>
            </div>

            <div>
              <span>Paid Sales</span>
              <strong>
                {money(paidSales)}
              </strong>
            </div>

            <div>
              <span>Unpaid Amount</span>
              <strong>
                {money(unpaidSales)}
              </strong>
            </div>

            <div>
              <span>Total Sales</span>
              <strong>
                {money(totalSales)}
              </strong>
            </div>
          </div>

          <div className="statement-table-wrapper">
            {selectedOrders.length === 0 ? (
              <div className="mini-empty">
                No orders were recorded for this business day.
              </div>
            ) : (
              <table className="statement-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Table</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        {order.orderNumber}
                      </td>

                      <td>
                        Table {order.tableNumber}
                      </td>

                      <td>
                        {order.items
                          .map(
                            (item) =>
                              `${item.quantity} × ${item.name}`
                          )
                          .join(", ")}
                      </td>

                      <td>
                        {money(order.total)}
                      </td>

                      <td>
                        {order.paymentStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="statement-footer">
            <span>
              MANORA Café
            </span>

            <strong>
              Come for the Taste. Stay for the Feeling.
            </strong>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   OWNER MENU MANAGEMENT
========================================================= */

function OwnerMenu({
  foods,
  addFood,
  deleteFood,
  showAddFood,
  setShowAddFood,
}) {
  return (
    <section className="owner-section">
      <div className="section-toolbar">
        <div>
          <p className="eyebrow">
            MENU MANAGEMENT
          </p>

          <h2>
            Manage Food
          </h2>

          <p>
            Add, update and remove items from the
            customer menu.
          </p>
        </div>

        <button
          className="gold-button"
          onClick={() =>
            setShowAddFood(!showAddFood)
          }
        >
          {showAddFood
            ? "Close"
            : "+ Add New Food"}
        </button>
      </div>

      {showAddFood && (
        <AddFoodForm
          addFood={(food) => {
            addFood(food);
            setShowAddFood(false);
          }}
        />
      )}

      <div className="manage-food-grid">
        {foods.map((food) => (
          <div
            className="manage-food-card"
            key={food.id}
          >
            <div className="manage-food-image">
              <img
                src={food.image}
                alt={food.name}
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            </div>

            <div className="manage-food-content">
              <span>
                {food.category}
              </span>

              <h3>{food.name}</h3>

              <p>{food.description}</p>

              <strong>
                {money(food.price)}
              </strong>

              <button
                className="delete-food-button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Remove ${food.name}?`
                    )
                  ) {
                    deleteFood(food.id);
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   ADD FOOD FORM
========================================================= */

function AddFoodForm({ addFood }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] =
    useState("Coffee");
  const [description, setDescription] =
    useState("");
  const [image, setImage] = useState("");

  function handleImageUpload(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Enter the food name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Enter a valid price.");
      return;
    }

    if (!description.trim()) {
      alert("Enter a food description.");
      return;
    }

    addFood({
      name: name.trim(),
      price: Number(price),
      category,
      description: description.trim(),
      image:
        image ||
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    });

    setName("");
    setPrice("");
    setCategory("Coffee");
    setDescription("");
    setImage("");
  }

  return (
    <div className="add-food-card">
      <div>
        <p className="eyebrow">
          NEW MENU ITEM
        </p>

        <h2>
          Add Food Item
        </h2>

        <p>
          Add the item customers will see on the
          website.
        </p>
      </div>

      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            Food Name
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. MANORA Special"
            />
          </label>

          <label>
            Price ₹
            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="199"
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option>Coffee</option>
              <option>Tea</option>
              <option>Burgers</option>
              <option>Pizza</option>
              <option>Pasta</option>
              <option>Starters</option>
              <option>Sandwiches</option>
              <option>Momos</option>
              <option>Mocktails</option>
              <option>Milkshakes</option>
              <option>Desserts</option>
            </select>
          </label>

          <label>
            Image URL
            <input
              value={
                image.startsWith("data:")
                  ? ""
                  : image
              }
              onChange={(e) =>
                setImage(e.target.value)
              }
              placeholder="Paste image URL"
            />
          </label>
        </div>

        <label>
          Food Description
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe the food..."
          />
        </label>

        <label className="upload-label">
          Upload Food Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>

        {image && (
          <div className="image-preview">
            <img
              src={image}
              alt="Preview"
            />
          </div>
        )}

        <button
          className="gold-button"
          type="submit"
        >
          + Add Food Item
        </button>
      </form>
    </div>
  );
}