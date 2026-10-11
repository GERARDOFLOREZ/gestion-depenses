function MixedCurrencyNotice({ title }) {
  return (
    <section className="summary">
      <h2>{title}</h2>
      <p className="hint">
        Vos comptes sont dans des devises différentes : on ne peut pas les additionner.
        Choisissez un compte précis dans le sélecteur ci-dessus pour voir ce graphique.
      </p>
    </section>
  );
}

export default MixedCurrencyNotice;
