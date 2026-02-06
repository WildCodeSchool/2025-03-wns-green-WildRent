export const ProductFilter = () => {
    return(
        <div className="w-1/4 h-full sticky top-2 bg-[var(--dark-green)] rounded-2xl flex flex-col gap-3">
            <div className="m-4 flex flex-col gap-6">

                {/* Filtre par genre */}
                <div className="flex flex-col gap-3">
                    <div className="border-b-1 border-[var(--kaki)]">
                        <h1 className="pb-2 text-[var(--beige)] text-xl font-[family-name:var(--font-title)]">Filtrer par genre</h1>
                    </div>
                    <div className="flex flex-col gap-2 mx-3">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox"/>
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Femme</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">562</p>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox" />
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Homme</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">344</p>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox" />
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Enfant</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">18</p>
                        </div>
                        
                    </div>
                </div>

                {/* Filtre par genre */}
                <div className="flex flex-col gap-3">
                    <div className="border-b-1 border-[var(--kaki)]">
                        <h1 className="pb-2 text-[var(--beige)] text-xl font-[family-name:var(--font-title)]">Filtrer par taille</h1>
                    </div>
                    <div className="flex flex-col gap-2 mx-3">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox" />
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Taille unique</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">10</p>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox" />
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">150cm</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">8</p>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox" />
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">140cm</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">7</p>
                        </div>
                    </div>
                </div>

                {/* Filtre par couleur */}
                <div className="flex flex-col gap-3">
                    <div className="border-b-1 border-[var(--kaki)]">
                        <h1 className="pb-2 text-[var(--beige)] text-xl font-[family-name:var(--font-title)]">Filtrer par couleur</h1>
                    </div>

                    <div className="flex flex-col gap-2 mx-3">

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Bleu</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">10</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="w-4 h-4 rounded-full bg-black"></div>
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Noir</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">15</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Orange</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">32</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Jaune</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">8</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Rouge</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">1</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Vert</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">24</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <div className="w-4 h-4 rounded-full bg-white"></div>
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Blanc</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">13</p>
                        </div>

                    </div>
                </div>

                {/* Filtre par marque */}
                <div className="flex flex-col gap-3">
                    <div className="border-b-1 border-[var(--kaki)]">
                        <h1 className="pb-2 text-[var(--beige)] text-xl font-[family-name:var(--font-title)]">Filtrer par marque</h1>
                    </div>
                    <div className="flex flex-col gap-2 mx-3">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox" />
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Salomon</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">14</p>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox" />
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Rossignol</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">1</p>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-3">
                                <input type="checkbox" />
                                <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">Lange</p>
                            </div>
                            <p className="text-[var(--beige)] text-sm font-[family-name:var(--font-text)]">4</p>
                        </div>
                    </div>
                </div>

                {/* Bouton de validation des filtres */}
                <div className="flex flex-row gap-4 justify-center my-2">
                    <button>
                        <p className="text-[var(--light-green)]">Réinitialiser</p>
                    </button>
                    <button className="
                        bg-[#fdffe9] 
                        text-[#31380d]
                        border-2 border-[#87a700]
                        text-xs
                        font-[family-name:var(--font-text)]
                        font-bold
                        px-3 sm:px-5
                        py-1.5 sm:py-2
                        rounded-full
                        whitespace-nowrap
                        shadow-sm
                        hover:bg-[#87a700] hover:text-[#fdffe9] 
                        transition-colors
                    ">
                        <p>Appliquer</p>
                    </button>
                </div>

            </div>
        </div>
    )
};