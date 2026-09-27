const form = document.getElementById("product-form");
let produtosCache = [];
let galeriaAtual = [];
let unsubscribeProdutos = null;

const $ = id => document.getElementById(id);
const formatarPreco = valor => Number(valor).toLocaleString("pt-BR", {style:"currency", currency:"BRL"});

// Só usuário autenticado entra no painel.
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  ouvirProdutos();
});

function ouvirProdutos() {
  if (unsubscribeProdutos) unsubscribeProdutos();
  unsubscribeProdutos = db.collection("produtos").orderBy("criadoEm", "desc").onSnapshot(snapshot => {
    produtosCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderAdmin();
  }, erro => {
    console.error(erro);
    $("admin-products").innerHTML = `<p style="color:#b42318;padding:20px 0">Não foi possível carregar os produtos. Confira as regras do Firestore.</p>`;
  });
}

function renderAdmin() {
  const area = $("admin-products");
  area.innerHTML = "";
  if (!produtosCache.length) {
    area.innerHTML = `<p style="color:#667085;padding:20px 0">Nenhum produto cadastrado no Firebase.</p>`;
    return;
  }
  produtosCache.forEach(produto => {
    const item = document.createElement("div");
    item.className = "admin-product";
    item.innerHTML = `
      <img src="${produto.imagem || ''}" alt="${produto.nome || ''}" onerror="this.src='https://placehold.co/200x200?text=Lyon'">
      <div><h3>${produto.nome || ''}</h3><p>${produto.categoria || ''} • ${formatarPreco(produto.preco || 0)}</p><p>Tamanhos: ${(produto.tamanhos || []).join(", ")}</p></div>
      <div class="admin-product-actions">
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Excluir</button>
      </div>`;
    item.querySelector('.edit-btn').onclick = () => editarProduto(produto.id);
    item.querySelector('.delete-btn').onclick = () => excluirProduto(produto.id);
    area.appendChild(item);
  });
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const botao = form.querySelector('button[type="submit"]');
  const id = $("product-id").value;
  const nome = $("product-name").value.trim();
  const categoria = $("product-category").value;
  const clube = $("product-club")?.value.trim() || "";
  const temporada = $("product-season")?.value.trim() || "";
  const qualidade = $("product-quality")?.value.trim() || "Qualidade Tailandesa";
  const preco = Number($("product-price").value.trim().replace(",", "."));
  const imagem = $("product-image").value.trim();
  const tamanhos = $("product-sizes").value.split(",").map(x=>x.trim()).filter(Boolean);

  if (!nome || !imagem || !Number.isFinite(preco) || preco <= 0) {
    alert("Preencha nome, preço e pelo menos uma foto.");
    return;
  }

  const dados = { nome, categoria, clube, temporada, qualidade, preco, imagem, galeria: galeriaAtual, tamanhos, atualizadoEm: firebase.firestore.FieldValue.serverTimestamp() };
  try {
    if (botao) { botao.disabled = true; botao.textContent = "SALVANDO..."; }
    if (id) {
      await db.collection("produtos").doc(id).set(dados, {merge:true});
    } else {
      dados.criadoEm = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection("produtos").add(dados);
    }
    limparFormulario();
    alert("Produto salvo no Firebase! Ele já está disponível para todos no site.");
  } catch (e) {
    console.error(e);
    if (e.code === 'resource-exhausted' || String(e.message).toLowerCase().includes('maximum')) {
      alert("As fotos ficaram grandes demais. Remova algumas fotos ou use imagens menores.");
    } else {
      alert("Não foi possível salvar. Confira se você está logado e se publicou as regras do Firestore.");
    }
  } finally {
    if (botao) { botao.disabled = false; botao.textContent = id ? "SALVAR ALTERAÇÕES" : "SALVAR PRODUTO"; }
  }
});

function editarProduto(id) {
  const produto = produtosCache.find(p => p.id === id);
  if (!produto) return;
  $("product-id").value = produto.id;
  $("product-name").value = produto.nome || "";
  $("product-category").value = produto.categoria || "Brasileira";
  $("product-price").value = produto.preco || "";
  $("product-club").value = produto.clube || "";
  $("product-season").value = produto.temporada || "";
  $("product-quality").value = produto.qualidade || "Qualidade Tailandesa";
  $("product-sizes").value = (produto.tamanhos || []).join(",");
  definirGaleria((produto.galeria && produto.galeria.length) ? produto.galeria : [produto.imagem]);
  $("form-title").textContent = "Editar camisa";
  window.scrollTo({top:0,behavior:"smooth"});
}

async function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir esta camisa?")) return;
  try { await db.collection("produtos").doc(id).delete(); }
  catch(e) { console.error(e); alert("Não foi possível excluir o produto."); }
}

function limparFormulario() {
  form.reset();
  $("product-id").value = "";
  $("product-image").value = "";
  $("product-image-url").value = "";
  $("product-gallery").value = "[]";
  $("product-quality").value = "Qualidade Tailandesa";
  $("product-price").value = "149.99";
  $("product-sizes").value = "P,M,G,GG";
  $("form-title").textContent = "Nova camisa";
  definirGaleria([]);
}

async function logout() { await auth.signOut(); window.location.href = "login.html"; }

// Upload de várias imagens. Elas são reduzidas para caber no documento do Firestore.
const imageDropZone = $("image-drop-zone");
const imageFileInput = $("product-image-file");
const imageHiddenInput = $("product-image");
const galleryHiddenInput = $("product-gallery");
const imageUrlInput = $("product-image-url");
const selectImageBtn = $("select-image-btn");
const addMoreImagesBtn = $("add-more-images-btn");
const multiPreview = $("multi-image-preview");

function salvarGaleriaNoForm() {
  galleryHiddenInput.value = JSON.stringify(galeriaAtual);
  imageHiddenInput.value = galeriaAtual[0] || "";
  renderGaleriaPreview();
}
function definirGaleria(lista) { galeriaAtual = (lista || []).filter(Boolean); salvarGaleriaNoForm(); }
function renderGaleriaPreview() {
  if (!multiPreview) return;
  multiPreview.innerHTML = galeriaAtual.map((src,i)=>`<div class="multi-preview-item ${i===0?'cover':''}"><img src="${src}" alt="Foto ${i+1}"><span>${i===0?'CAPA':`FOTO ${i+1}`}</span><div class="multi-preview-actions">${i!==0?`<button type="button" onclick="tornarCapa(${i})">Capa</button>`:''}<button type="button" class="danger" onclick="removerFotoGaleria(${i})">✕</button></div></div>`).join('');
}
function tornarCapa(i){ const [foto]=galeriaAtual.splice(i,1); galeriaAtual.unshift(foto); salvarGaleriaNoForm(); }
function removerFotoGaleria(i){ galeriaAtual.splice(i,1); salvarGaleriaNoForm(); }

function arquivoParaDataURL(arquivo) {
  return new Promise((resolve,reject)=>{
    if(!arquivo.type.startsWith("image/")) return reject(new Error("Formato inválido: "+arquivo.name));
    if(arquivo.size>12*1024*1024) return reject(new Error(`${arquivo.name} passa de 12 MB`));
    const leitor=new FileReader();
    leitor.onerror=reject;
    leitor.onload=()=>{
      const img=new Image();
      img.onerror=()=>reject(new Error("Não foi possível ler "+arquivo.name));
      img.onload=()=>{
        const max=700; let w=img.width,h=img.height;
        if(w>max||h>max){const escala=Math.min(max/w,max/h);w=Math.round(w*escala);h=Math.round(h*escala);}
        const canvas=document.createElement("canvas"); canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL("image/jpeg",0.55));
      }; img.src=leitor.result;
    }; leitor.readAsDataURL(arquivo);
  });
}

async function processarArquivosImagem(arquivos) {
  for(const arquivo of [...arquivos]){
    try{
      const foto=await arquivoParaDataURL(arquivo);
      const tamanhoEstimado = [...galeriaAtual, foto].reduce((n,s)=>n+s.length,0);
      if(tamanhoEstimado>850000){ alert("Limite de fotos atingido para esta camisa. Use menos fotos ou imagens menores."); break; }
      galeriaAtual.push(foto);
    }catch(e){alert(e.message||`Não foi possível carregar ${arquivo.name}.`);}
  }
  imageFileInput.value=""; imageUrlInput.value=""; salvarGaleriaNoForm();
}
selectImageBtn?.addEventListener("click",e=>{e.stopPropagation();imageFileInput.click();});
addMoreImagesBtn?.addEventListener("click",e=>{e.stopPropagation();imageFileInput.click();});
imageDropZone?.addEventListener("click",e=>{if(!e.target.closest("button"))imageFileInput.click();});
imageFileInput?.addEventListener("change",()=>processarArquivosImagem(imageFileInput.files));
["dragenter","dragover"].forEach(t=>imageDropZone?.addEventListener(t,e=>{e.preventDefault();imageDropZone.classList.add("dragover");}));
["dragleave","drop"].forEach(t=>imageDropZone?.addEventListener(t,e=>{e.preventDefault();imageDropZone.classList.remove("dragover");}));
imageDropZone?.addEventListener("drop",e=>processarArquivosImagem(e.dataTransfer.files));
imageUrlInput?.addEventListener("change",()=>{const url=imageUrlInput.value.trim();if(url){galeriaAtual.push(url);imageUrlInput.value="";salvarGaleriaNoForm();}});
