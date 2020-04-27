function id(len) {
	len = len || 8;
	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	return Math.random().toString(36).substring(2, 2+len) + Math.random().toString(36).substring(2, 2+len)
}

function addStyles() {
	const id = 'spyral-file-input-styles';
	const head = document.querySelector('head');
	if (head.querySelector('style[id="'+id+'"]') === null) {
		const style = document.createElement('style');
		style.setAttribute('id', id);
		style.appendChild(document.createTextNode(`
.input-parent {
	padding: 8px;
	background-color: #fff;
	outline: 2px dashed #999;
	text-align: center;
}
.input-parent.is-dragover {
	background-color: #ccc;
}
.input-parent strong {
	cursor: pointer;
}
.input-parent input {
	display: none;
}
`))
		head.appendChild(style);
	}
}

/**
 * A multiple file input that features drag n drop as well as temporary file storage in session storage.
 */
class FileInput {

	constructor(target) {
		this.target = target;
	}

	init(resolve) {
		const me = this;

		// file load handler
		function triggerLoad(fileList) {
			const files = Array.from(fileList);
			const readFiles = [];

			const target = me.target;
			const fr = new FileReader();
			fr.onload = (e) => {
				const file = e.target.result;
				readFiles.push(file);
				if (files.length > 0) {
					fr.readAsText(files.shift());
				} else {
					// store each file in its own session storage entry
					const childIds = readFiles.map((val, index) => {
						const childId = id(32);
						window.sessionStorage.setItem(childId, val);
						return childId;
						
					})
					// store the ids for each file for later retrieval
					window.sessionStorage.setItem(target.getAttribute('spyral-temp-doc'), childIds.join());
					
					resolve(readFiles);
				}
			}

			fr.readAsText(files.shift());
		}

		// update label with file info
		function showFiles(files) {
			inputLabel.textContent = files.length > 1 ? (fileInput.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
		}

		
		addStyles();

		// construct the elements
		const inputParent = document.createElement('div');
		inputParent.setAttribute('class', 'input-parent');

		const fileInputId = id(16);
		const fileInput = document.createElement('input');
		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('multiple', 'multiple');
		fileInput.setAttribute('data-multiple-caption', '{count} files selected');
		fileInput.setAttribute('id', fileInputId);
		fileInput.addEventListener('change', function(event) {
			showFiles(this.files);
			triggerLoad(this.files);
		}, false);
		inputParent.appendChild(fileInput);

		const inputLabel = document.createElement('label');
		inputLabel.setAttribute('for', fileInputId);
		inputParent.appendChild(inputLabel);
		
		const labelText = document.createElement('strong');
		labelText.appendChild(document.createTextNode('Choose a file'));
		inputLabel.appendChild(labelText);

		const dndSpot = document.createElement('span');
		dndSpot.setAttribute('class', 'box__dragndrop');
		dndSpot.appendChild(document.createTextNode(' or drag it here'));
		inputLabel.appendChild(dndSpot);

		['drag','dragstart','dragend','dragover','dragenter','dragleave','drop'].forEach((event) => {
			inputParent.addEventListener(event, (e) => {
				e.preventDefault();
				e.stopPropagation();
			})
		});
		['dragover','dragenter'].forEach((event) => {
			inputParent.addEventListener(event, (e) => {
				inputParent.classList.add('is-dragover');
			})
		});
		['dragend','dragleave','drop'].forEach((event) => {
			inputParent.addEventListener(event, (e) => {
				inputParent.classList.remove('is-dragover');
			})
		});
		inputParent.addEventListener('drop', (e) => {
			showFiles(e.dataTransfer.files);
			triggerLoad(e.dataTransfer.files);
		});


		this.target.appendChild(inputParent);
		this.target.setAttribute('spyral-temp-doc', id(32));
	}

	static getStoredFiles(target) {
		if (target.hasAttribute('spyral-temp-doc')) {
			const fileIds = window.sessionStorage.getItem(target.getAttribute('spyral-temp-doc'));
			if (fileIds !== null) {
				const storedFiles = fileIds.split(',').map((fileId) => {
					return window.sessionStorage.getItem(fileId);
				})
				return storedFiles;
			}
		}
		return null;
	}
}

export default FileInput
