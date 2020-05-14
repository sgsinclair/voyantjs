import Util from './util';

/**
 * A multiple file input that features drag n drop as well as temporary file storage in session storage.
 */
class FileInput {

	/**
	 * The FileInput constructor
	 * @param {element} target The element to place the file input into
	 * @param {function} resolve A function to call with the file(s)
	 * @param {function} reject A function to call if the input is cancelled
	 */
	constructor(target, resolve, reject) {
		this.target = target;
		this.resolve = resolve;
		this.reject = reject;
		
		this.inputParent = undefined;
		this.fileInput = undefined;
		this.inputLabel = undefined;

		if (target.hasAttribute('spyral-temp-doc')) {
			const storedFiles = FileInput.getStoredFiles(target);
			if (storedFiles !== null) {
				resolve(storedFiles);
			}
		} else {
			this._init();
		}
	}

	_init() {
		addStyles();

		// construct the elements
		this.inputParent = document.createElement('div');
		this.inputParent.setAttribute('class', 'input-parent');

		const fileInputId = Util.id(16);
		this.fileInput = document.createElement('input');
		this.fileInput.setAttribute('type', 'file');
		this.fileInput.setAttribute('multiple', 'multiple');
		this.fileInput.setAttribute('data-multiple-caption', '{count} files selected');
		this.fileInput.setAttribute('id', fileInputId);
		this.fileInput.addEventListener('change', (event) => {
			this._showFiles(event.target.files);
			this._triggerLoad(event.target.files);
		});
		this.inputParent.appendChild(this.fileInput);

		this.inputLabel = document.createElement('label');
		this.inputLabel.setAttribute('for', fileInputId);
		this.inputParent.appendChild(this.inputLabel);
		
		const labelText = document.createElement('strong');
		labelText.appendChild(document.createTextNode('Choose a file'));
		this.inputLabel.appendChild(labelText);

		const dndSpot = document.createElement('span');
		dndSpot.setAttribute('class', 'box__dragndrop');
		dndSpot.appendChild(document.createTextNode(' or drag it here'));
		this.inputLabel.appendChild(dndSpot);

		['drag','dragstart','dragend','dragover','dragenter','dragleave','drop'].forEach((event) => {
			this.inputParent.addEventListener(event, (e) => {
				e.preventDefault();
				e.stopPropagation();
			})
		});
		['dragover','dragenter'].forEach((event) => {
			this.inputParent.addEventListener(event, (e) => {
				this.inputParent.classList.add('is-dragover');
			})
		});
		['dragend','dragleave','drop'].forEach((event) => {
			this.inputParent.addEventListener(event, (e) => {
				this.inputParent.classList.remove('is-dragover');
			})
		});
		this.inputParent.addEventListener('drop', (event) => {
			this._showFiles(event.dataTransfer.files);
			this._triggerLoad(event.dataTransfer.files);
		});


		this.target.appendChild(this.inputParent);
		this.target.setAttribute('spyral-temp-doc', Util.id(32));
	}

	// update label with file info
	_showFiles(files) {
		this.inputLabel.textContent = files.length > 1 ? (this.fileInput.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name;
	}

	// file load handler
	_triggerLoad(fileList) {
		const files = Array.from(fileList);
		const readFiles = [];

		const target = this.target;
		const fr = new FileReader();
		fr.onload = (e) => {
			const file = e.target.result;
			readFiles.push(file);
			if (files.length > 0) {
				fr.readAsText(files.shift());
			} else {
				// store each file in its own session storage entry
				const childIds = readFiles.map((val, index) => {
					const childId = Util.id(32);
					window.sessionStorage.setItem(childId, val);
					return childId;
					
				})
				// store the ids for each file for later retrieval
				window.sessionStorage.setItem(target.getAttribute('spyral-temp-doc'), childIds.join());
				
				this.resolve(readFiles);
			}
		}

		fr.readAsText(files.shift());
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

export default FileInput
