// window.addEventListener("load", () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "show_definitions") {
      const definitions = request.defs;
      const definitionList = document.createElement("div");
      definitionList.id = "definition_list";
      definitionList.onclick = (() => {
        const definitionList = document.getElementById("definition_list");
        definitionList.remove();
      });
  
      let definitionBox = document.createElement("ol");
      definitions.forEach((definition) => {
        let definitionItem = document.createElement("li");
        definitionItem.classList.add("definition_item");
        definitionItem.textContent = definition;
        definitionBox.appendChild(definitionItem);
      });
      definitionList.appendChild(definitionBox);
      document.body.appendChild(definitionList);
      sendResponse({ message: "Showed definition list" });
    }
    else {
      sendResponse({ message: "Wrong command" })
    }
  })
  // })
  
  const textNodesUnder = (el) => {
    const children = [] 
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, (node) => node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'STYLE')
    while (walker.nextNode()) {
      children.push(walker.currentNode)
    }
    return children;
  }
  
  const hightlightKeyword = (textNode, textOffset, textToHighlight) => {
    //Identify the start and end location of keyword in textnode
    const range = document.createRange();
    range.setStart(textNode, textOffset);
    range.setEnd(textNode, textOffset + textToHighlight.length);
  
    const wrapper = document.createElement('span');
    wrapper.classList.add('highlighted');
    range.surroundContents(wrapper);
  }
  
  const highlightContent = (textToHighlight) => {
    const allTextNodes = textNodesUnder(document.body);
    var matchingElements = allTextNodes.filter(textNode => textNode.textContent.toLowerCase().includes(textToHighlight.toLowerCase()));
  
  
    for (let textNode of matchingElements) {
  
      const textNodeParent = textNode.parentNode;
      var allChildrenNodes = textNodeParent.childNodes;
      var startingNodePosition = Array.from(allChildrenNodes).indexOf(textNode);
  
      while (allChildrenNodes[startingNodePosition].textContent.toLowerCase().indexOf(textToHighlight.toLowerCase()) !== -1) {
  
        const textOffset = allChildrenNodes[startingNodePosition].textContent.toLowerCase().indexOf(textToHighlight.toLowerCase());
  
        hightlightKeyword(allChildrenNodes[startingNodePosition], textOffset, textToHighlight);
  
        startingNodePosition += 2;
      }
    }
  }
  
  chrome.runtime.sendMessage({
    command: 'get_keys',
  }, (response) => {
    console.log(response);
    for (const key of response) {
      highlightContent(key);
    };
  })
  