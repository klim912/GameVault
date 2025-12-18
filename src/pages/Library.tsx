import { useLibrary } from "../components/LibraryContext";
import jsPDF from "jspdf";

function Library() {
  const { library, receipts } = useLibrary();

  const generatePDF = (receipt: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.text("Квитанція про покупку", 20, 20);
    doc.text(`Номер замовлення: ${receipt.orderId}`, 20, 30);
    doc.text(`Дата: ${new Date(receipt.date).toLocaleString("uk-UA")}`, 20, 40);
    doc.text(`Сума: $${receipt.amount}`, 20, 50);
    doc.text(`Спосіб оплати: ${receipt.paymentMethod}`, 20, 60);
    doc.text("Придбані ігри:", 20, 70);
    receipt.games.forEach((game: any, index: number) => {
      doc.text(
        `${game.title} x${game.quantity} - $${(
          Number(game.price) * game.quantity
        ).toFixed(2)}`,
        20,
        80 + index * 10
      );
    });
    doc.save(`receipt-${receipt.orderId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-black font-mono text-white py-12 px-4">
      <div className="max-w-6xl mx-auto mt-16">
        <h2
          className="text-3xl md:text-4xl font-bold text-lime-400 mb-10 text-center tracking-wider relative
          before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:bg-lime-500/50"
        >
          ВАША БІБЛІОТЕКА
        </h2>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <h3 className="text-xl text-lime-400 mb-4">Придбані ігри</h3>
            {library.length === 0 ? (
              <p className="text-neutral-500">Бібліотека порожня</p>
            ) : (
              <ul className="space-y-4">
                {library.map((item) => (
                  <li
                    key={`${item.orderId}-${item.title}`}
                    className="flex justify-between"
                  >
                    <span>{item.title}</span>
                    <span>
                      {new Date(item.purchaseDate).toLocaleDateString("uk-UA")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-xl text-lime-400 mb-4">Квитанції</h3>
            {receipts.length === 0 ? (
              <p className="text-neutral-500">Квитанцій немає</p>
            ) : (
              <ul className="space-y-4">
                {receipts.map((receipt) => (
                  <li
                    key={receipt.orderId}
                    className="bg-neutral-950/90 border border-lime-500/30 p-4 rounded-md"
                  >
                    <div className="flex justify-between">
                      <span>Замовлення {receipt.orderId}</span>
                      <button
                        onClick={() => generatePDF(receipt)}
                        className="text-lime-400 hover:underline"
                      >
                        Завантажити квитанцію
                      </button>
                    </div>
                    <p>{new Date(receipt.date).toLocaleString("uk-UA")}</p>
                    <p>Сума: ${receipt.amount}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Library;
