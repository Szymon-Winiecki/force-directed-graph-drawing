# Rysowanie grafu oparte na odwzorowaniu sił fizycznych

Autor : Szymon Winiecki 148149

Algorytmy rysujące graf w oparciu o symulację fizyczną (ang. Force-directed graph drawing algorithms) to rodzina algorytmów mających za zadanie stworzyć przejrzystą i estetyczną wizualizację grafu. Krawędzie najczęściej odwzorowane są jako sprężyny, których napięcie zależy od odległosći między wierzchołkami końcowymi, natomiast wierzchołki symulowane są jako odpychjące się cząsteczki o jednakowym ładunku elektrycznym. Działanie algorytmów oparte jest na minimalizacji energii układu poprzez symualcje jego fizycznych właściwości.

Stworzone przeze mnie narzędzie implementuje trzy algorytmy rozmieszczające grafy:

1. algorytm zaproponowany przez Petera Eadesa [1]
2. algorytm zaproponowany przez Thomasa M. J. Fruchtermana i Edwarda M. Reingolda [2]
3. algorytm zaproponowany przez Arne Frick, Andreas Ludwig i Heiko Mehldau [3]

Program pozwala obserwować proces rozmieszczania wierzchołków na losowo wygenerowanych lub wcześniej przygotwanych grafach, wybranie algorytmu oraz zmianę parametrów używanych przy symulacji.

Bibliografia:
  - Force-Directed Drawing Algorithms; Stephen G. Kobourov; University of Arizona
  - A Fast Adaptive Layout Algorithm for Undirected Graphs; Arne Frick, Andreas Ludwig, Heiko Mehldau; Universität Karlsruhe

  [1] P. Eades. A heuristic for graph drawing. Congressus Numerantium, 1984.

  [2] T. Fruchterman and E. Reingold. Graph drawing by force-directed placement. Softw. – Pract.Exp., 1991.

  [3] A. Frick, A. Ludwig, and H. Mehldau. A fast adaptive layout algorithm for undirected graphs. In R. Tamassia and I. G. Tollis, editors, Proceedings of the 2nd Symposium on Graph Drawing (GD), volume 894 of Lecture Notes in Computer Science. Springer-Verlag, 1995.
