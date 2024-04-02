'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged,
	signInWithFacebook
} from "@/src/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import { useRouter } from "next/navigation";
import { getAuth, signInWithPopup, FacebookAuthProvider, getRedirectResult } from "firebase/auth";

function useUserSession(initialUser) {
	// The initialUser comes from the server through a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter();
	

	useEffect(() => {
			const unsubscribe = onAuthStateChanged(authUser => {
					setUser(authUser);
			});
			return () => {
					unsubscribe();
			};
	}, []);


	useEffect(() => {
			// onAuthStateChanged(async authUser => {
			// 		// if (user === undefined) return;
			// 		// if (user?.email !== authUser?.email) {
			// 		// 		router.refresh();
			// 		// }
					
			// });

			const data = getAuth()
			console.log('onAuthStateChanged ', data)
	}, [user]);

	return user;
}


export default function Header({initialUser}) {

	const user = useUserSession(initialUser) ;
	const [dataFacebook, setDataFacebook] = useState(null)
	const provider = new FacebookAuthProvider();
	const auths = getAuth();
	provider.addScope('email, pages_show_list,pages_read_engagement,pages_read_user_content');

	const handleSignOut = event => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = event => {
		event.preventDefault();
		// signInWithGoogle();
		// signInWithFacebook();
		signInWithPopup(auths, provider)
			.then((result) => {
				// The signed-in user info.
				const user = result.user;

				// This gives you a Facebook Access Token. You can use it to access the Facebook API.
				const credential = FacebookAuthProvider.credentialFromResult(result);
				const accessToken = credential.accessToken;
				
				console.log('credential => ', credential)
				console.log('user => ', user)
				setDataFacebook(credential)
				// IdP data available using getAdditionalUserInfo(result)
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential = FacebookAuthProvider.credentialFromError(error);

				// ...
			});
	};
	

	return (
		<header>
			<Link href="/" className="logo">
				<img src="/friendly-eats.svg" alt="FriendlyEats" />
				Friendly Eats
			</Link>
			{user ? (
				<>
					<div className="profile">
						<p>
							<img src="/profile.svg" alt={user.email} />
							{user.displayName}
						</p>

						<div className="menu">
							...
							<ul>
								<li>{user.displayName}</li>

								<li>
									<a
										href="#"
										onClick={addFakeRestaurantsAndReviews}
									>
										Add sample restaurants
									</a>
								</li>

								<li>
									<a href="#" onClick={handleSignOut}>
										Sign Out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</>
			) : (
				<a href="#" onClick={handleSignIn}>
					Sign In with Facebook
				</a>
			)}
		</header>
	);
}
