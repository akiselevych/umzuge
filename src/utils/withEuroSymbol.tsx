const withEuroSymbol = (element: JSX.Element) => {
  const containerStyles = { position: "relative" as const }
  const euroSymbolStyles = {
    position: "absolute" as const,
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)" as const,
  }

  return (
    <div style={containerStyles}>
      {element}
      <span style={euroSymbolStyles}>€</span>
    </div>
  )
}

export default withEuroSymbol
