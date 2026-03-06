import { useMutation } from "@apollo/client/react"
import { useState } from "react"
import { Link } from "react-router"
import { LOGIN_USER } from "../graphql/auth.operations"

type UserInput = {
   email: string, 
   password: string
}

type UserProfilData = {
    name: string,
}
export const LoginPage = () => {
    const [user, setUser] = useState<UserInput>({ email: "", password: ""});
    const[login, {loading, error}] = useMutation<{User: UserProfilData}>(LOGIN_USER, );

    const changeFieldValue = (field: string, value: string) => {
        setUser({...user, [field]: value})
    };

    const handleLogin = async () => {
        try {
            const result = await login({variables: { email: user?.email, password: user?.password }});
            console.log("Connexion Réussie");
            console.log(result)
            
        } catch (error) {
            console.error("erreur de connexion", error)
        }
    }

    return(
        <div className="flex flex-col gap-5 items-center">
            <div className="w-xs flex flex-col gap-3">
                <label htmlFor="">Email</label>
                <input type="text" value={user?.email} className="border border-black rounded-lg" onChange={(e) => changeFieldValue("email", e.target.value)}/>
            </div>
            <div className="w-xs flex flex-col gap-3">
                <label htmlFor="">Mot de passe</label>
                <input type="text" value={user?.password} className="border border-black rounded-lg" onChange={(e) => changeFieldValue("password", e.target.value)}/>
            </div>
            <Link to="" className="w-xs bg-[#31380d] rounded-lg py-1" onClick={() => handleLogin()}>
                <p className="text-white text-center">Connexion</p>
            </Link>

            {loading && <p>Connexion en cours</p>}
            {error && <p>Email ou mot de passe incorect</p>}
        </div>
    )
}