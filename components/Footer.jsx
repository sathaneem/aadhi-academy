export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-6 mt-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} AADHI Academy. All rights reserved.</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/terms" className="hover:text-white">Terms</a>
        </div>
      </div>
    </footer>
  );
}
