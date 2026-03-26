 "use client";

import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  maxProperties: number;
  features?: string[];
}

interface SubscriptionRequest {
  _id: string;
  planName: string;
  planPrice: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// ─── Popup: Pending Approval ──────────────────────────────────────────────────
function PendingPopup({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const WHATSAPP_NUMBER = "+92-300-1234567"; // 🔁 Apna number yahan lagao
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Assalam o Alaikum! Main "${plan.name}" plan lena chahta/chahti hoon. Price: PKR ${plan.price}. Please confirm karein.`
  )}`;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submit Ho Gayi! 🎉</h2>
        <p className="text-gray-500 mb-1 text-sm">Plan: <strong>{plan.name}</strong></p>
        <p className="text-gray-500 mb-5 text-sm">
          Price: <strong className="text-green-600">PKR {plan.price}</strong>
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 font-semibold text-sm mb-1">⏳ Admin Approval Ka Wait Karein</p>
          <p className="text-yellow-700 text-xs">
            Aapki subscription request admin ko bhej di gayi hai. Jaldi approve ho jaayegi.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800 font-semibold text-sm mb-2">💳 Payment Ke Liye WhatsApp Karein</p>
          <p className="text-green-700 text-xs mb-3">
            Payment details aur confirmation ke liye hamein WhatsApp par message karein:
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {WHATSAPP_NUMBER}
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Theek Hai, Close Karein
        </button>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config =
    {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    }[status] || "bg-gray-100 text-gray-700";

  const label =
    { pending: "⏳ Pending", approved: "✅ Approved", rejected: "❌ Rejected" }[status] || status;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config}`}>
      {label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [myRequests, setMyRequests] = useState<SubscriptionRequest[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/admin/plans");
        const data = await res.json();
        setPlans(data.plans || []);
      } catch (err) {
        console.error("Plans fetch error:", err);
      } finally {
        setFetchingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  // Fetch my requests — cookie automatic bhejti hai
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await fetch("/api/subscription-requests");
        if (res.ok) {
          const data = await res.json();
          setMyRequests(data.requests || []);
        }
      } catch (err) {
        console.error("My requests fetch error:", err);
      }
    };
    fetchMyRequests();
  }, []);

  const handleApply = async (plan: Plan) => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan._id,
          planName: plan.name,
          planPrice: plan.price,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        alert("Pehle login karein!");
        return;
      }

      if (!res.ok) {
        alert(data.error || "Kuch masla hua. Dobara try karein.");
        return;
      }

      setSelectedPlan(plan);

      const reqRes = await fetch("/api/subscription-requests");
      const reqData = await reqRes.json();
      setMyRequests(reqData.requests || []);
    } catch (err) {
      console.error("Apply error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
          <p className="text-gray-500">Apni zaroorat ke mutabiq plan chunein</p>
        </div>

        {fetchingPlans ? (
          <div className="text-center py-16 text-gray-400">Plans load ho rahe hain...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Abhi koi plan available nahi hai.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {plans.map((plan) => {
              const hasPending = myRequests.some(
                (r) => r.planName === plan.name && r.status === "pending"
              );
              const hasApproved = myRequests.some(
                (r) => r.planName === plan.name && r.status === "approved"
              );

              return (
                <div key={plan._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                  <p className="text-3xl font-extrabold text-blue-600 mb-1">PKR {plan.price}</p>
                  <p className="text-gray-400 text-sm mb-4">
                    {plan.duration} din · Max {plan.maxProperties} properties
                  </p>

                  {plan.features && plan.features.length > 0 && (
                    <ul className="text-sm text-gray-600 mb-6 flex-1 space-y-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto">
                    {hasApproved ? (
                      <div className="text-center py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">
                        ✅ Already Active
                      </div>
                    ) : hasPending ? (
                      <div className="text-center py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm font-semibold">
                        ⏳ Approval Pending
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(plan)}
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
                      >
                        {loading ? "Submit ho raha hai..." : "Apply Karein"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {myRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Meri Requests</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Plan</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Price</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((req) => (
                    <tr key={req._id} className="border-b border-gray-50 last:border-0">
                      <td className="px-6 py-4 font-medium text-gray-900">{req.planName}</td>
                      <td className="px-6 py-4 text-gray-600">PKR {req.planPrice}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(req.createdAt).toLocaleDateString("en-PK")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedPlan && (
        <PendingPopup plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
}