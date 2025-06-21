import React, { useEffect, useState } from "react";
import { useRole } from "../../App";
import { db } from "../../App";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function MyReviewsPage() {
  const { role } = useRole();
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        let q;
        if (role === "owner") {
          q = query(collection(db, "reviews"), where("ownerUid", "==", user.uid));
        } else {
          q = query(collection(db, "reviews"), where("tenantUid", "==", user.uid));
        }
        const snapshot = await getDocs(q);
        const reviews = [];
        snapshot.forEach(doc => reviews.push(doc.data()));
        setMyReviews(reviews);
      } catch (err) {
        setMyReviews([]);
      }
      setLoading(false);
    };
    fetchMyReviews();
  }, [role]);

  return (
    <section className="my-reviews-page">
      <h2 className="text-2xl font-bold mb-6" style={{ textAlign: "center", marginTop: 0 }}>
        My Reviews & Ratings
      </h2>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        {loading ? (
          <p>Loading your reviews...</p>
        ) : myReviews.length === 0 ? (
          <p>No reviews found for you yet.</p>
        ) : (
          myReviews.map((review, idx) => (
            <div key={idx} className="card" style={{ marginBottom: 16 }}>
              {role === "owner" && (
                <>
                  <div>
                    <strong>Flat:</strong> {review.flatAddress || "N/A"}
                  </div>
                  <div>
                    <strong>Owner Rating:</strong> {review.ownerRating || "N/A"}
                  </div>
                </>
              )}
              <div>
                <strong>Review:</strong> {review.review}
              </div>
              <div>
                <strong>Rating:</strong> {review.rating}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default MyReviewsPage;