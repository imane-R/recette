function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} RecettesDélices. Tous droits réservés.
        </p>
        <div className="flex justify-center space-x-6 mt-3">
          <a href="#" className="hover:text-blue-400">
            Mentions légales
          </a>
          <a href="#" className="hover:text-blue-400">
            Contact
          </a>
          <a href="#" className="hover:text-blue-400">
            Politique de confidentialité
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
